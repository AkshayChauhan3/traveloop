const prisma = require('../lib/prisma');

const ACTIVITY_CATEGORIES = new Set(['ADVENTURE', 'FOOD', 'CULTURE', 'NATURE', 'NIGHTLIFE', 'RELAXATION']);

const normalizeCategory = (category) => {
  if (!category) return 'RELAXATION';

  const normalized = String(category).trim().toUpperCase();
  return ACTIVITY_CATEGORIES.has(normalized) ? normalized : 'RELAXATION';
};

const getAccessibleStop = (stopId, userId) => prisma.tripStop.findFirst({
  where: {
    id: parseInt(stopId, 10),
    trip: {
      OR: [
        { userId },
        { members: { some: { userId } } }
      ]
    }
  },
  include: {
    city: true,
    trip: true
  }
});

// ===== CREATE ACTIVITY =====
const createActivity = async (data, userId) => {
  try {
    if (!data.stop_id || !data.name) {
      return {
        success: false,
        message: 'Missing required fields: stop_id, name'
      };
    }

    const stop = await getAccessibleStop(data.stop_id, userId);

    if (!stop) {
      return {
        success: false,
        message: 'Stop not found or unauthorized'
      };
    }

    const estimatedCost = data.estimated_cost !== undefined ? parseFloat(data.estimated_cost) : null;
    const scheduledTime = data.start_time || null;
    const duration = data.duration_hours !== undefined ? String(data.duration_hours) : null;
    const normalizedCategory = normalizeCategory(data.category);
    const activityName = data.name.trim();

    const existingCityActivity = stop.cityId
      ? await prisma.cityActivity.findFirst({
          where: {
            cityId: stop.cityId,
            name: { equals: activityName, mode: 'insensitive' }
          }
        })
      : null;

    const cityActivity = existingCityActivity || (stop.cityId
      ? await prisma.cityActivity.create({
          data: {
            cityId: stop.cityId,
            name: activityName,
            category: normalizedCategory,
            description: data.description || null,
            duration,
            price: estimatedCost,
            availabilityTime: scheduledTime
          }
        })
      : null);

    const activity = await prisma.tripActivity.create({
      data: {
        tripStopId: parseInt(data.stop_id, 10),
        cityActivityId: cityActivity ? cityActivity.id : null,
        customActivity: cityActivity ? null : activityName,
        notes: data.notes || data.description || null,
        estimatedCost,
        scheduledTime
      },
      include: {
        cityActivity: {
          include: {
            city: true
          }
        }
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
    const stop = await getAccessibleStop(stopId, userId);

    if (!stop) {
      return {
        success: false,
        message: 'Stop not found or unauthorized'
      };
    }

    const stopActivities = await prisma.tripActivity.findMany({
      where: {
        tripStopId: parseInt(stopId, 10)
      },
      include: {
        cityActivity: {
          include: {
            city: true
          }
        }
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
    const activity = await prisma.tripActivity.findFirst({
      where: {
        id: parseInt(activityId, 10),
        tripStop: {
          trip: {
            OR: [
              { userId },
              { members: { some: { userId } } }
            ]
          }
        }
      },
      include: {
        cityActivity: {
          include: {
            city: true
          }
        },
        tripStop: {
          include: {
            city: true,
            trip: true
          }
        }
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
    const existingActivity = await prisma.tripActivity.findFirst({
      where: {
        id: parseInt(activityId, 10),
        tripStop: {
          trip: {
            OR: [
              { userId },
              { members: { some: { userId } } }
            ]
          }
        }
      },
      include: {
        cityActivity: true,
        tripStop: true
      }
    });
    
    if (!existingActivity) {
      return {
        success: false,
        message: 'Activity not found or unauthorized'
      };
    }

    const updateData = {};
    const hasName = data.name !== undefined;
    const hasCategory = data.category !== undefined;
    const hasDuration = data.duration_hours !== undefined;
    const hasCost = data.estimated_cost !== undefined;
    const hasStartTime = data.start_time !== undefined;

    if (existingActivity.cityActivityId) {
      const cityActivityUpdate = {};
      if (hasName) cityActivityUpdate.name = data.name;
      if (hasCategory) cityActivityUpdate.category = normalizeCategory(data.category);
      if (data.description !== undefined) cityActivityUpdate.description = data.description;
      if (hasDuration) cityActivityUpdate.duration = String(data.duration_hours);
      if (hasCost) cityActivityUpdate.price = parseFloat(data.estimated_cost);
      if (hasStartTime) cityActivityUpdate.availabilityTime = data.start_time;

      if (Object.keys(cityActivityUpdate).length > 0) {
        await prisma.cityActivity.update({
          where: { id: existingActivity.cityActivityId },
          data: cityActivityUpdate
        });
      }
    } else {
      if (hasName) updateData.customActivity = data.name;
    }

    if (data.notes !== undefined) updateData.notes = data.notes;
    if (hasCost) updateData.estimatedCost = parseFloat(data.estimated_cost);
    if (hasStartTime) updateData.scheduledTime = data.start_time;

    const activity = await prisma.tripActivity.update({
      where: { id: parseInt(activityId, 10) },
      data: updateData,
      include: {
        cityActivity: {
          include: {
            city: true
          }
        }
      }
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
    const existingActivity = await prisma.tripActivity.findFirst({
      where: {
        id: parseInt(activityId, 10),
        tripStop: {
          trip: {
            OR: [
              { userId },
              { members: { some: { userId } } }
            ]
          }
        }
      }
    });
    
    if (!existingActivity) {
      return {
        success: false,
        message: 'Activity not found or unauthorized'
      };
    }

    const activity = await prisma.tripActivity.update({
      where: { id: parseInt(activityId, 10) },
      data: {
        completed: true
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
    const existingActivity = await prisma.tripActivity.findFirst({
      where: {
        id: parseInt(activityId, 10),
        tripStop: {
          trip: {
            OR: [
              { userId },
              { members: { some: { userId } } }
            ]
          }
        }
      }
    });
    
    if (!existingActivity) {
      return {
        success: false,
        message: 'Activity not found or unauthorized'
      };
    }

    const deletedActivity = await prisma.tripActivity.delete({
      where: { id: parseInt(activityId, 10) }
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
