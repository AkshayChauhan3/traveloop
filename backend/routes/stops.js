const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { 
  createStop, 
  getStopsByTrip, 
  getStopById, 
  updateStop, 
  deleteStop 
} = require('../controllers/stopsController');

// ===== CREATE STOP FOR A TRIP =====
// POST /api/stops
// Body: { trip_id, city, country?, arrival_date, departure_date, accommodation?, notes? }
router.post('/', verifyToken, async (req, res) => {
  try {
    const result = await createStop(req.body, req.body.trip_id, req.userId);
    
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

// ===== GET ALL STOPS FOR A TRIP =====
// GET /api/stops?trip_id=X
router.get('/', verifyToken, async (req, res) => {
  try {
    const tripId = req.query.trip_id;
    
    if (!tripId) {
      return res.status(400).json({
        success: false,
        message: 'Missing trip_id query parameter'
      });
    }

    const result = await getStopsByTrip(tripId, req.userId);
    
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

// ===== GET SINGLE STOP =====
// GET /api/stops/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await getStopById(req.params.id, req.userId);
    
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

// ===== UPDATE STOP =====
// PUT /api/stops/:id
// Body: { city?, country?, arrival_date?, departure_date?, accommodation?, notes? }
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const result = await updateStop(req.params.id, req.body, req.userId);
    
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

// ===== DELETE STOP =====
// DELETE /api/stops/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await deleteStop(req.params.id, req.userId);
    
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
