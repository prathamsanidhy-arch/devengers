const express = require('express');
const router = express.Router();

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, radius = 15000 } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      console.error('Missing GEOAPIFY_API_KEY in .env file');
      return res.status(500).json({ error: 'GEOAPIFY_API_KEY is not configured in backend' });
    }

    // Categories to match govt offices, hospitals, police, electricity, etc.
    // Geoapify categories: office, healthcare.hospital, service.police, public_transport, commercial
    const categories = 'office.government,office.administrative,healthcare.hospital,service.police,commercial.supermarket,public_transport,building.office';
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=100&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      console.error('Geoapify API Error:', text);
      return res.status(response.status).json({ error: 'Error from Geoapify API', details: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Geoapify Request Error:', error);
    res.status(500).json({ error: 'Failed to fetch places from Geoapify', details: error.message });
  }
});

router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      console.error('Missing GEOAPIFY_API_KEY in .env file');
      return res.status(500).json({ error: 'GEOAPIFY_API_KEY is not configured in backend' });
    }

    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      console.error('Geoapify Reverse API Error:', text);
      return res.status(response.status).json({ error: 'Error from Geoapify Reverse API', details: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Geoapify Reverse Request Error:', error);
    res.status(500).json({ error: 'Failed to reverse geocode from Geoapify', details: error.message });
  }
});

module.exports = router;
