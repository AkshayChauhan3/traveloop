const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { 
  createTrip, 
  getUserTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip 
} = require('../controllers/tripsController');

// ===== CREATE TRIP =====
// POST /api/trips
// Body: { name, description, start_date, end_date, total_budget }
router.post('/', verifyToken, (req, res) => {
  try {
    const result = createTrip(req.body, req.userId);
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        message: result.message 
      });
    }

    return res.status(201).json({
      success: true,
      message: result.message,
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

// ===== GET ALL USER TRIPS =====
// GET /api/trips
router.get('/', verifyToken, (req, res) => {
  try {
    const result = getUserTrips(req.userId);
    
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

// ===== GET SINGLE TRIP =====
// GET /api/trips/:id
router.get('/:id', verifyToken, (req, res) => {
  try {
    const result = getTripById(req.params.id, req.userId);
    
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

// ===== UPDATE TRIP =====
// PUT /api/trips/:id
// Body: { name?, description?, start_date?, end_date?, total_budget?, status? }
router.put('/:id', verifyToken, (req, res) => {
  try {
    const result = updateTrip(req.params.id, req.body, req.userId);
    
    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
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

// ===== DELETE TRIP =====
// DELETE /api/trips/:id
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const result = deleteTrip(req.params.id, req.userId);
    
    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
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
