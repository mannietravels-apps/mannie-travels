export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { number } = req.query;
  if (!number) return res.status(400).json({ error: 'No flight number' });
  
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return res.status(500).json({ error: 'API key not configured' });
  
  try {
    const flightNum = number.toUpperCase().trim();
    
    // Try today and next 2 days
    const results = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const date = d.toISOString().slice(0, 10);
      
      const url = `https://aerodatabox.p.rapidapi.com/flights/number/${encodeURIComponent(flightNum)}/${date}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
          'x-rapidapi-key': key,
          'Content-Type': 'application/json'
        }
      });
      
      const text = await response.text();
      
      if (response.ok) {
        try {
          const data = JSON.parse(text);
          if (data && Array.isArray(data) && data.length > 0) {
            const f = data[0];
            const dep = f.departure || {};
            const arr = f.arrival || {};
            const airline = f.airline || {};
            const aircraft = f.aircraft || {};
            
            const depTime = dep.scheduledTime && dep.scheduledTime.local 
              ? dep.scheduledTime.local.slice(11, 16) : '';
            const arrTime = arr.scheduledTime && arr.scheduledTime.local 
              ? arr.scheduledTime.local.slice(11, 16) : '';
            
            let dur = '';
            if (depTime && arrTime) {
              const depM = parseInt(depTime.slice(0,2))*60 + parseInt(depTime.slice(3,5));
              const arrM = parseInt(arrTime.slice(0,2))*60 + parseInt(arrTime.slice(3,5));
              let diff = arrM - depM;
              if (diff < 0) diff += 1440;
              dur = Math.floor(diff/60) + 'h ' + (diff%60) + 'm';
            }
            
            return res.status(200).json({
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
            });
          }
        } catch(e) {
          results.push({ date, status: response.status, error: 'parse error', text: text.slice(0,200) });
        }
      } else {
        results.push({ date, status: response.status, text: text.slice(0,200) });
      }
    }
    
    // Return debug info if nothing found
    return res.status(404).json({ 
      error: 'Flight not found', 
      flightNum,
      debug: results 
    });
    
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
