const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { 
  searchCities, 
  getCityDetails, 
  searchActivities, 
  getTrendingDestinations, 
  getDestinationRecommendations 
} = require('../controllers/searchController');

// ===== SEARCH CITIES =====
// GET /api/search/cities?q=paris
router.get('/cities', async (req, res) => {
  try {
    const query = req.query.q;
    const result = await searchCities(query);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ===== GET CITY DETAILS =====
// GET /api/search/cities/:name
router.get('/cities/:name', async (req, res) => {
  try {
    const result = await getCityDetails(req.params.name);
    
    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ===== SEARCH ACTIVITIES =====
// GET /api/search/activities?q=hiking
router.get('/activities', async (req, res) => {
  try {
    const query = req.query.q;
    const result = await searchActivities(query);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ===== GET TRENDING DESTINATIONS =====
// GET /api/search/trending
router.get('/trending', async (req, res) => {
  try {
    const result = await getTrendingDestinations();
    
    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ===== GET RECOMMENDATIONS =====
// GET /api/search/recommendations?budget=5000
router.get('/recommendations', verifyToken, async (req, res) => {
  try {
    const preferences = {
      budget: req.query.budget ? parseFloat(req.query.budget) : 5000,
      interests: req.query.interests ? req.query.interests.split(',') : [],
      duration_days: req.query.duration ? parseInt(req.query.duration) : 7
    };

    const result = await getDestinationRecommendations(req.userId, preferences);
    
    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
