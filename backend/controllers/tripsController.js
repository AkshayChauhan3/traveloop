// Mock database for trips (will be replaced with PostgreSQL queries)
let trips = [];
let tripIdCounter = 1;

// ===== CREATE TRIP =====
const createTrip = (data, userId) => {
  try {
    if (!data.name || !data.description || !data.start_date || !data.end_date || !data.total_budget) {
      return {
        success: false,
        message: 'Missing required fields: name, description, start_date, end_date, total_budget'
      };
    }

    // Validate dates
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    if (startDate >= endDate) {
      return {
        success: false,
        message: 'End date must be after start date'
      };
    }

    const trip = {
      id: tripIdCounter++,
      user_id: userId,
      name: data.name,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      total_budget: data.total_budget,
      spent_amount: 0,
      status: 'planned', // planned, ongoing, completed
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    trips.push(trip);

    return {
      success: true,
      message: 'Trip created successfully',
      data: trip
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error creating trip',
      error: error.message
    };
  }
};

// ===== GET ALL TRIPS FOR USER =====
const getUserTrips = (userId) => {
  try {
    const userTrips = trips.filter(trip => trip.user_id === userId);
    return {
      success: true,
      data: userTrips
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching trips',
      error: error.message
    };
  }
};

// ===== GET SINGLE TRIP =====
const getTripById = (tripId, userId) => {
  try {
    const trip = trips.find(t => t.id === parseInt(tripId) && t.user_id === userId);
    
    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    return {
      success: true,
      data: trip
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching trip',
      error: error.message
    };
  }
};

// ===== UPDATE TRIP =====
const updateTrip = (tripId, data, userId) => {
  try {
    const tripIndex = trips.findIndex(t => t.id === parseInt(tripId) && t.user_id === userId);
    
    if (tripIndex === -1) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const trip = trips[tripIndex];

    // Update allowed fields
    if (data.name !== undefined) trip.name = data.name;
    if (data.description !== undefined) trip.description = data.description;
    if (data.start_date !== undefined) trip.start_date = data.start_date;
    if (data.end_date !== undefined) trip.end_date = data.end_date;
    if (data.total_budget !== undefined) trip.total_budget = data.total_budget;
    if (data.status !== undefined) trip.status = data.status;
    
    trip.updated_at = new Date().toISOString();
    trips[tripIndex] = trip;

    return {
      success: true,
      message: 'Trip updated successfully',
      data: trip
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error updating trip',
      error: error.message
    };
  }
};

// ===== DELETE TRIP =====
const deleteTrip = (tripId, userId) => {
  try {
    const tripIndex = trips.findIndex(t => t.id === parseInt(tripId) && t.user_id === userId);
    
    if (tripIndex === -1) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const deletedTrip = trips.splice(tripIndex, 1);

    return {
      success: true,
      message: 'Trip deleted successfully',
      data: deletedTrip[0]
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error deleting trip',
      error: error.message
    };
  }
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip
};
