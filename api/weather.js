const axios = require('axios');

export default async function handler(req, res) {
  const { endpoint, city, lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY; // Loaded from Vercel environment variables

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
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}