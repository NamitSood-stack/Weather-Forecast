export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    const { endpoint, city, lat, lon } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
  
    if (!apiKey) {
      console.error('API key missing:', process.env);
      return res.status(500).json({ error: 'API key configuration error' });
    }
  
    // ... rest of your existing code ...
  
    try {
      console.log('Fetching from URL:', url); // Debug log
      const response = await axios.get(url);
      console.log('API Response:', response.status); // Debug log
      
      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      return res.status(error.response?.status || 500).json({
        error: 'Weather API error',
        message: error.response?.data?.message || error.message
      });
    }
  }