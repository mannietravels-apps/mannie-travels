export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { number } = req.query;
  if (!number) return res.status(400).json({ error: 'No flight number' });
  
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return res.status(500).json({ error: 'API key not configured' });
  
  try {
    // Get today's date for the flight lookup
    const today = new Date().toISOString().slice(0, 10);
    const flightNum = number.toUpperCase().trim();
    
    // Try today first, then tomorrow
    const dates = [today];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dates.push(tomorrow.toISOString().slice(0, 10));
    
    let flightData = null;
    
    for (const date of dates) {
      const url = `https://aerodatabox.p.rapidapi.com/flights/number/${encodeURIComponent(flightNum)}/${date}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
          'x-rapidapi-key': key
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          flightData = data[0];
          break;
        }
      }
    }
    
    if (!flightData) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    
    // Map AeroDataBox response to our app format
    const dep = flightData.departure || {};
    const arr = flightData.arrival || {};
    const airline = flightData.airline || {};
    const aircraft = flightData.aircraft || {};
    
    // Extract times (scheduled time)
    const depTime = dep.scheduledTime && dep.scheduledTime.local 
      ? dep.scheduledTime.local.slice(11, 16) 
      : '';
    const arrTime = arr.scheduledTime && arr.scheduledTime.local 
      ? arr.scheduledTime.local.slice(11, 16) 
      : '';
    
    // Calculate duration
    let dur = '';
    if (depTime && arrTime) {
      const depM = parseInt(depTime.slice(0,2))*60 + parseInt(depTime.slice(3,5));
      const arrM = parseInt(arrTime.slice(0,2))*60 + parseInt(arrTime.slice(3,5));
      let diff = arrM - depM;
      if (diff < 0) diff += 1440;
      dur = Math.floor(diff/60) + 'h ' + (diff%60) + 'm';
    }
    
    const result = {
      al: airline.name || '',
      dc: dep.airport ? (dep.airport.iata || '') : '',
      dCity: dep.airport ? (dep.airport.municipalityName || dep.airport.name || '') : '',
      dTerm: dep.terminal || '',
      dep: depTime,
      ac: arr.airport ? (arr.airport.iata || '') : '',
      aCity: arr.airport ? (arr.airport.municipalityName || arr.airport.name || '') : '',
      aTerm: arr.terminal || '',
      arr: arrTime,
      plane: aircraft.model || '',
      dur: dur
    };
    
    return res.status(200).json(result);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
