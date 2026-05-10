const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { 
  createActivity, 
  getActivitiesByStop, 
  getActivityById, 
  updateActivity, 
  markActivityComplete, 
  deleteActivity 
} = require('../controllers/activitiesController');

// ===== CREATE ACTIVITY =====
// POST /api/extras/activities
// Body: { stop_id, name, description?, category?, duration_hours?, estimated_cost?, start_time?, notes? }
router.post('/activities', verifyToken, async (req, res) => {
  try {
    const result = await createActivity(req.body, req.userId);
    
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

// ===== GET ACTIVITIES FOR A STOP =====
// GET /api/extras/activities?stop_id=X
router.get('/activities', verifyToken, async (req, res) => {
  try {
    const stopId = req.query.stop_id;
    
    if (!stopId) {
      return res.status(400).json({
        success: false,
        message: 'Missing stop_id query parameter'
      });
    }

    const result = await getActivitiesByStop(stopId, req.userId);
    
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

// ===== GET SINGLE ACTIVITY =====
// GET /api/extras/activities/:id
router.get('/activities/:id', verifyToken, async (req, res) => {
  try {
    const result = await getActivityById(req.params.id, req.userId);
    
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

// ===== UPDATE ACTIVITY =====
// PUT /api/extras/activities/:id
// Body: { name?, description?, category?, duration_hours?, estimated_cost?, start_time?, notes? }
router.put('/activities/:id', verifyToken, async (req, res) => {
  try {
    const result = await updateActivity(req.params.id, req.body, req.userId);
    
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

// ===== MARK ACTIVITY COMPLETE =====
// PATCH /api/extras/activities/:id/complete
router.patch('/activities/:id/complete', verifyToken, async (req, res) => {
  try {
    const result = await markActivityComplete(req.params.id, req.userId);
    
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

// ===== DELETE ACTIVITY =====
// DELETE /api/extras/activities/:id
router.delete('/activities/:id', verifyToken, async (req, res) => {
  try {
    const result = await deleteActivity(req.params.id, req.userId);
    
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
