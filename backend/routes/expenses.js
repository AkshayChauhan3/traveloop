const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { 
  createExpense, 
  getExpensesByTrip, 
  getExpensesByStop, 
  getBudgetSummary, 
  updateExpense, 
  deleteExpense 
} = require('../controllers/expensesController');

// ===== CREATE EXPENSE =====
// POST /api/expenses
// Body: { trip_id, stop_id?, category, amount, description?, date? }
router.post('/', verifyToken, async (req, res) => {
  try {
    const result = await createExpense(req.body, req.userId);
    
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

// ===== GET EXPENSES FOR A TRIP =====
// GET /api/expenses?trip_id=X
router.get('/', verifyToken, async (req, res) => {
  try {
    const tripId = req.query.trip_id;
    const stopId = req.query.stop_id;
    
    let result;
    if (stopId) {
      result = await getExpensesByStop(stopId, req.userId);
    } else if (tripId) {
      result = await getExpensesByTrip(tripId, req.userId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Missing trip_id or stop_id query parameter'
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

// ===== GET BUDGET SUMMARY FOR A TRIP =====
// GET /api/expenses/:tripId/summary?total_budget=X
router.get('/:tripId/summary', verifyToken, async (req, res) => {
  try {
    const totalBudget = parseFloat(req.query.total_budget);
    
    if (Number.isNaN(totalBudget)) {
      return res.status(400).json({
        success: false,
        message: 'Missing total_budget query parameter'
      });
    }

    const result = await getBudgetSummary(req.params.tripId, totalBudget, req.userId);
    
    if (!result.success) {
      return res.status(500).json(result);
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

// ===== UPDATE EXPENSE =====
// PUT /api/expenses/:id
// Body: { category?, amount?, description?, date?, stop_id? }
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const result = await updateExpense(req.params.id, req.body, req.userId);
    
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

// ===== DELETE EXPENSE =====
// DELETE /api/expenses/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await deleteExpense(req.params.id, req.userId);
    
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
