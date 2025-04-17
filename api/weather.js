const axios = require('axios');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { endpoint, city, lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error('API key missing');
    return res.status(500).json({ error: 'API key configuration error' });
  }

  let url;
  if (endpoint === 'weather' && city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  } else if (endpoint === 'weather' && lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  } else if (endpoint === 'forecast' && lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  } else {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  try {
    const response = await axios.get(url);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: 'Weather API error',
      message: error.response?.data?.message || error.message
    });
  }
}