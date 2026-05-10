const prisma = require('../lib/prisma');

const getAccessibleTrip = (tripId, userId) => prisma.trip.findFirst({
  where: {
    id: parseInt(tripId, 10),
    OR: [
      { userId },
      { members: { some: { userId } } }
    ]
  }
});

const getAccessibleStop = (stopId, tripId, userId) => prisma.tripStop.findFirst({
  where: {
    id: parseInt(stopId, 10),
    tripId: parseInt(tripId, 10),
    trip: {
      OR: [
        { userId },
        { members: { some: { userId } } }
      ]
    }
  }
});

// ===== CREATE EXPENSE =====
const createExpense = async (data, userId) => {
  try {
    if (!data.trip_id || !data.category || data.amount === undefined) {
      return {
        success: false,
        message: 'Missing required fields: trip_id, category, amount'
      };
    }

    const trip = await getAccessibleTrip(data.trip_id, userId);

    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    let stop = null;
    if (data.stop_id) {
      stop = await getAccessibleStop(data.stop_id, data.trip_id, userId);

      if (!stop) {
        return {
          success: false,
          message: 'Stop not found or does not belong to the trip'
        };
      }
    }

    const expense = await prisma.expense.create({
      data: {
        tripId: parseInt(data.trip_id, 10),
        stopId: stop ? stop.id : null,
        userId,
        category: String(data.category).toLowerCase(),
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
    const trip = await getAccessibleTrip(tripId, userId);

    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const tripExpenses = await prisma.expense.findMany({
      where: {
        tripId: parseInt(tripId, 10)
      },
      orderBy: { date: 'desc' }
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
    const stop = await prisma.tripStop.findFirst({
      where: {
        id: parseInt(stopId, 10),
        trip: {
          OR: [
            { userId },
            { members: { some: { userId } } }
          ]
        }
      }
    });

    if (!stop) {
      return {
        success: false,
        message: 'Stop not found or unauthorized'
      };
    }

    const stopExpenses = await prisma.expense.findMany({
      where: {
        stopId: parseInt(stopId, 10)
      },
      orderBy: { date: 'desc' }
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
    const trip = await getAccessibleTrip(tripId, userId);

    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const tripExpenses = await prisma.expense.findMany({
      where: {
        tripId: parseInt(tripId, 10)
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
        spending_percentage: totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(2) : '0.00',
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
        id: parseInt(expenseId, 10),
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
    if (data.category !== undefined) updateData.category = String(data.category).toLowerCase();
    if (data.amount !== undefined) updateData.amount = parseFloat(data.amount);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.stop_id !== undefined) updateData.stopId = data.stop_id ? parseInt(data.stop_id, 10) : null;

    const expense = await prisma.expense.update({
      where: { id: parseInt(expenseId, 10) },
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
        id: parseInt(expenseId, 10),
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
      where: { id: parseInt(expenseId, 10) }
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
