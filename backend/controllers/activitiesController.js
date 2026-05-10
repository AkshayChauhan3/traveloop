const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===== CREATE ACTIVITY =====
const createActivity = async (data, userId) => {
  try {
    if (!data.stop_id || !data.name) {
      return {
        success: false,
        message: 'Missing required fields: stop_id, name'
      };
    }

    const activity = await prisma.activity.create({
      data: {
        stopId: parseInt(data.stop_id),
        userId,
        name: data.name,
        description: data.description || null,
        category: data.category || 'sightseeing',
        durationHours: data.duration_hours || 2,
        estimatedCost: parseFloat(data.estimated_cost) || 0,
        startTime: data.start_time || '09:00',
        notes: data.notes || null
      }
    });

    return {
      success: true,
      message: 'Activity created successfully',
      data: activity
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error creating activity',
      error: error.message
    };
  }
};

// ===== GET ACTIVITIES FOR A STOP =====
const getActivitiesByStop = async (stopId, userId) => {
  try {
    const stopActivities = await prisma.activity.findMany({
      where: {
        stopId: parseInt(stopId),
        userId
      }
    });

    return {
      success: true,
      data: stopActivities
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching activities',
      error: error.message
    };
  }
};

// ===== GET SINGLE ACTIVITY =====
const getActivityById = async (activityId, userId) => {
  try {
    const activity = await prisma.activity.findFirst({
      where: {
        id: parseInt(activityId),
        userId
      }
    });
    
    if (!activity) {
      return {
        success: false,
        message: 'Activity not found or unauthorized'
      };
    }

    return {
      success: true,
      data: activity
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching activity',
      error: error.message
    };
  }
};

// ===== UPDATE ACTIVITY =====
const updateActivity = async (activityId, data, userId) => {
  try {
    const existingActivity = await prisma.activity.findFirst({
      where: {
        id: parseInt(activityId),
        userId
      }
    });
    
    if (!existingActivity) {
      return {
        success: false,
        message: 'Activity not found or unauthorized'
      };
    }

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.duration_hours !== undefined) updateData.durationHours = data.duration_hours;
    if (data.estimated_cost !== undefined) updateData.estimatedCost = parseFloat(data.estimated_cost);
    if (data.start_time !== undefined) updateData.startTime = data.start_time;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const activity = await prisma.activity.update({
      where: { id: parseInt(activityId) },
      data: updateData
    });

    return {
      success: true,
      message: 'Activity updated successfully',
      data: activity
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error updating activity',
      error: error.message
    };
  }
};

// ===== MARK ACTIVITY COMPLETE =====
const markActivityComplete = async (activityId, userId) => {
  try {
    const existingActivity = await prisma.activity.findFirst({
      where: {
        id: parseInt(activityId),
        userId
      }
    });
    
    if (!existingActivity) {
      return {
        success: false,
        message: 'Activity not found or unauthorized'
      };
    }

    const activity = await prisma.activity.update({
      where: { id: parseInt(activityId) },
      data: {
        completed: true,
        completedAt: new Date()
      }
    });

    return {
      success: true,
      message: 'Activity marked as complete',
      data: activity
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error marking activity complete',
      error: error.message
    };
  }
};

// ===== DELETE ACTIVITY =====
const deleteActivity = async (activityId, userId) => {
  try {
    const existingActivity = await prisma.activity.findFirst({
      where: {
        id: parseInt(activityId),
        userId
      }
    });
    
    if (!existingActivity) {
      return {
        success: false,
        message: 'Activity not found or unauthorized'
      };
    }

    const deletedActivity = await prisma.activity.delete({
      where: { id: parseInt(activityId) }
    });

    return {
      success: true,
      message: 'Activity deleted successfully',
      data: deletedActivity
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error deleting activity',
      error: error.message
    };
  }
};

module.exports = {
  createActivity,
  getActivitiesByStop,
  getActivityById,
  updateActivity,
  markActivityComplete,
  deleteActivity
};
