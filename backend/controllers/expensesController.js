const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===== CREATE EXPENSE =====
const createExpense = async (data, userId) => {
  try {
    if (!data.trip_id || !data.category || data.amount === undefined) {
      return {
        success: false,
        message: 'Missing required fields: trip_id, category, amount'
      };
    }

    const expense = await prisma.expense.create({
      data: {
        tripId: parseInt(data.trip_id),
        stopId: data.stop_id ? parseInt(data.stop_id) : null,
        userId,
        category: data.category,
        amount: parseFloat(data.amount),
        description: data.description || null,
        date: data.date ? new Date(data.date) : new Date()
      }
    });

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
const getExpensesByTrip = async (tripId, userId) => {
  try {
    const tripExpenses = await prisma.expense.findMany({
      where: {
        tripId: parseInt(tripId),
        userId
      }
    });

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
const getExpensesByStop = async (stopId, userId) => {
  try {
    const stopExpenses = await prisma.expense.findMany({
      where: {
        stopId: parseInt(stopId),
        userId
      }
    });

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
const getBudgetSummary = async (tripId, totalBudget, userId) => {
  try {
    const tripExpenses = await prisma.expense.findMany({
      where: {
        tripId: parseInt(tripId),
        userId
      }
    });
    
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
const updateExpense = async (expenseId, data, userId) => {
  try {
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: parseInt(expenseId),
        userId
      }
    });
    
    if (!existingExpense) {
      return {
        success: false,
        message: 'Expense not found or unauthorized'
      };
    }

    const updateData = {};
    if (data.category !== undefined) updateData.category = data.category;
    if (data.amount !== undefined) updateData.amount = parseFloat(data.amount);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.stop_id !== undefined) updateData.stopId = data.stop_id ? parseInt(data.stop_id) : null;

    const expense = await prisma.expense.update({
      where: { id: parseInt(expenseId) },
      data: updateData
    });

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
const deleteExpense = async (expenseId, userId) => {
  try {
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: parseInt(expenseId),
        userId
      }
    });
    
    if (!existingExpense) {
      return {
        success: false,
        message: 'Expense not found or unauthorized'
      };
    }

    const deletedExpense = await prisma.expense.delete({
      where: { id: parseInt(expenseId) }
    });

    return {
      success: true,
      message: 'Expense deleted successfully',
      data: deletedExpense
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
