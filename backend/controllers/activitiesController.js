// Mock database for activities
let activities = [];
let activityIdCounter = 1;

// ===== CREATE ACTIVITY =====
const createActivity = (data, userId) => {
  try {
    if (!data.stop_id || !data.name) {
      return {
        success: false,
        message: 'Missing required fields: stop_id, name'
      };
    }

    const activity = {
      id: activityIdCounter++,
      stop_id: parseInt(data.stop_id),
      user_id: userId,
      name: data.name,
      description: data.description || '',
      category: data.category || 'sightseeing',
      duration_hours: data.duration_hours || 2,
      estimated_cost: parseFloat(data.estimated_cost) || 0,
      start_time: data.start_time || '09:00',
      completed: false,
      completed_at: null,
      notes: data.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    activities.push(activity);
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
const getActivitiesByStop = (stopId, userId) => {
  try {
    const stopActivities = activities.filter(a => a.stop_id === parseInt(stopId) && a.user_id === userId);
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
const getActivityById = (activityId, userId) => {
  try {
    const activity = activities.find(a => a.id === parseInt(activityId) && a.user_id === userId);
    
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
const updateActivity = (activityId, data, userId) => {
  try {
    const activityIndex = activities.findIndex(a => a.id === parseInt(activityId) && a.user_id === userId);
    
    if (activityIndex === -1) {
      return {
        success: false,
        message: 'Activity not found or unauthorized'
      };
    }

    const activity = activities[activityIndex];
    
    if (data.name !== undefined) activity.name = data.name;
    if (data.description !== undefined) activity.description = data.description;
    if (data.category !== undefined) activity.category = data.category;
    if (data.duration_hours !== undefined) activity.duration_hours = data.duration_hours;
    if (data.estimated_cost !== undefined) activity.estimated_cost = parseFloat(data.estimated_cost);
    if (data.start_time !== undefined) activity.start_time = data.start_time;
    if (data.notes !== undefined) activity.notes = data.notes;
    
    activity.updated_at = new Date().toISOString();
    activities[activityIndex] = activity;

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
const markActivityComplete = (activityId, userId) => {
  try {
    const activityIndex = activities.findIndex(a => a.id === parseInt(activityId) && a.user_id === userId);
    
    if (activityIndex === -1) {
      return {
        success: false,
        message: 'Activity not found or unauthorized'
      };
    }

    const activity = activities[activityIndex];
    activity.completed = true;
    activity.completed_at = new Date().toISOString();
    activity.updated_at = new Date().toISOString();
    activities[activityIndex] = activity;

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
const deleteActivity = (activityId, userId) => {
  try {
    const activityIndex = activities.findIndex(a => a.id === parseInt(activityId) && a.user_id === userId);
    
    if (activityIndex === -1) {
      return {
        success: false,
        message: 'Activity not found or unauthorized'
      };
    }

    const deletedActivity = activities.splice(activityIndex, 1);
    return {
      success: true,
      message: 'Activity deleted successfully',
      data: deletedActivity[0]
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
