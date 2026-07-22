export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { number } = req.query;
  if (!number) return res.status(400).json({ error: 'No flight number' });
  const key = process.env.AVIATIONSTACK_KEY;
  if (!key) return res.status(500).json({ error: 'API key not configured' });
  try {
    const url = `http://api.aviationstack.com/v1/flights?access_key=${key}&flight_iata=${encodeURIComponent(number.toUpperCase())}&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.data || data.data.length === 0) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    const f = data.data[0];
    const result = {
      al: f.airline ? f.airline.name : '',
      dc: f.departure ? f.departure.iata : '',
      dCity: f.departure ? (f.departure.airport || '') : '',
      dTerm: f.departure && f.departure.terminal ? f.departure.terminal : '',
      dep: f.departure && f.departure.scheduled ? f.departure.scheduled.slice(11,16) : '',
      ac: f.arrival ? f.arrival.iata : '',
      aCity: f.arrival ? (f.arrival.airport || '') : '',
      aTerm: f.arrival && f.arrival.terminal ? f.arrival.terminal : '',
      arr: f.arrival && f.arrival.scheduled ? f.arrival.scheduled.slice(11,16) : '',
      plane: f.aircraft ? (f.aircraft.iata || '') : '',
      dur: ''
    };
    // Calculate duration if both times available
    if (result.dep && result.arr) {
      var depM = parseInt(result.dep.slice(0,2))*60 + parseInt(result.dep.slice(3,5));
      var arrM = parseInt(result.arr.slice(0,2))*60 + parseInt(result.arr.slice(3,5));
      var diff = arrM - depM;
      if (diff < 0) diff += 1440;
      result.dur = Math.floor(diff/60) + 'h ' + (diff%60) + 'm';
    }
    return res.status(200).json(result);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
