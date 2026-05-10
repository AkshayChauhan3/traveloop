// Mock database for expenses
let expenses = [];
let expenseIdCounter = 1;

// ===== CREATE EXPENSE =====
const createExpense = (data, userId) => {
  try {
    if (!data.trip_id || !data.category || data.amount === undefined) {
      return {
        success: false,
        message: 'Missing required fields: trip_id, category, amount'
      };
    }

    const expense = {
      id: expenseIdCounter++,
      trip_id: parseInt(data.trip_id),
      stop_id: data.stop_id ? parseInt(data.stop_id) : null,
      user_id: userId,
      category: data.category,
      amount: parseFloat(data.amount),
      description: data.description || '',
      date: data.date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    expenses.push(expense);
    return {
      success: true,
      message: 'Expense created successfully',
      data: expense
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error creating expense',
      error: error.message
    };
  }
};

// ===== GET ALL EXPENSES FOR A TRIP =====
const getExpensesByTrip = (tripId, userId) => {
  try {
    const tripExpenses = expenses.filter(e => e.trip_id === parseInt(tripId) && e.user_id === userId);
    return {
      success: true,
      data: tripExpenses
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching expenses',
      error: error.message
    };
  }
};

// ===== GET EXPENSES FOR A SPECIFIC STOP =====
const getExpensesByStop = (stopId, userId) => {
  try {
    const stopExpenses = expenses.filter(e => e.stop_id === parseInt(stopId) && e.user_id === userId);
    return {
      success: true,
      data: stopExpenses
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching expenses',
      error: error.message
    };
  }
};

// ===== GET BUDGET SUMMARY FOR A TRIP =====
const getBudgetSummary = (tripId, totalBudget, userId) => {
  try {
    const tripExpenses = expenses.filter(e => e.trip_id === parseInt(tripId) && e.user_id === userId);
    
    const totalSpent = tripExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudget - totalSpent;
    
    // Break down by category
    const byCategory = {
      transport: 0,
      accommodation: 0,
      activities: 0,
      meals: 0,
      shopping: 0,
      other: 0
    };
    
    tripExpenses.forEach(expense => {
      if (byCategory.hasOwnProperty(expense.category)) {
        byCategory[expense.category] += expense.amount;
      }
    });

    return {
      success: true,
      data: {
        total_budget: totalBudget,
        total_spent: totalSpent.toFixed(2),
        remaining_budget: remaining.toFixed(2),
        spending_percentage: ((totalSpent / totalBudget) * 100).toFixed(2),
        by_category: byCategory,
        expense_count: tripExpenses.length
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error calculating budget summary',
      error: error.message
    };
  }
};

// ===== UPDATE EXPENSE =====
const updateExpense = (expenseId, data, userId) => {
  try {
    const expenseIndex = expenses.findIndex(e => e.id === parseInt(expenseId) && e.user_id === userId);
    
    if (expenseIndex === -1) {
      return {
        success: false,
        message: 'Expense not found or unauthorized'
      };
    }

    const expense = expenses[expenseIndex];
    
    if (data.category !== undefined) expense.category = data.category;
    if (data.amount !== undefined) expense.amount = parseFloat(data.amount);
    if (data.description !== undefined) expense.description = data.description;
    if (data.date !== undefined) expense.date = data.date;
    if (data.stop_id !== undefined) expense.stop_id = data.stop_id ? parseInt(data.stop_id) : null;
    
    expense.updated_at = new Date().toISOString();
    expenses[expenseIndex] = expense;

    return {
      success: true,
      message: 'Expense updated successfully',
      data: expense
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error updating expense',
      error: error.message
    };
  }
};

// ===== DELETE EXPENSE =====
const deleteExpense = (expenseId, userId) => {
  try {
    const expenseIndex = expenses.findIndex(e => e.id === parseInt(expenseId) && e.user_id === userId);
    
    if (expenseIndex === -1) {
      return {
        success: false,
        message: 'Expense not found or unauthorized'
      };
    }

    const deletedExpense = expenses.splice(expenseIndex, 1);
    return {
      success: true,
      message: 'Expense deleted successfully',
      data: deletedExpense[0]
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error deleting expense',
      error: error.message
    };
  }
};

module.exports = {
  createExpense,
  getExpensesByTrip,
  getExpensesByStop,
  getBudgetSummary,
  updateExpense,
  deleteExpense
};
