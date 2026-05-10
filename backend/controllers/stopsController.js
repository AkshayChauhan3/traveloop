// Mock database for stops (cities/locations in a trip)
let stops = [];
let stopIdCounter = 1;

// ===== CREATE STOP =====
const createStop = (data, tripId, userId) => {
  try {
    if (!data.city || !data.arrival_date || !data.departure_date) {
      return {
        success: false,
        message: 'Missing required fields: city, arrival_date, departure_date'
      };
    }

    // Validate dates
    const arrivalDate = new Date(data.arrival_date);
    const departureDate = new Date(data.departure_date);
    if (arrivalDate >= departureDate) {
      return {
        success: false,
        message: 'Departure date must be after arrival date'
      };
    }

    const stop = {
      id: stopIdCounter++,
      trip_id: tripId,
      user_id: userId,
      city: data.city,
      country: data.country || '',
      arrival_date: data.arrival_date,
      departure_date: data.departure_date,
      accommodation: data.accommodation || '',
      notes: data.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    stops.push(stop);

    return {
      success: true,
      message: 'Stop created successfully',
      data: stop
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error creating stop',
      error: error.message
    };
  }
};

// ===== GET STOPS FOR A TRIP =====
const getStopsByTrip = (tripId, userId) => {
  try {
    const tripStops = stops.filter(stop => stop.trip_id === parseInt(tripId) && stop.user_id === userId);
    return {
      success: true,
      data: tripStops
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching stops',
      error: error.message
    };
  }
};

// ===== GET SINGLE STOP =====
const getStopById = (stopId, userId) => {
  try {
    const stop = stops.find(s => s.id === parseInt(stopId) && s.user_id === userId);
    
    if (!stop) {
      return {
        success: false,
        message: 'Stop not found or unauthorized'
      };
    }

    return {
      success: true,
      data: stop
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching stop',
      error: error.message
    };
  }
};

// ===== UPDATE STOP =====
const updateStop = (stopId, data, userId) => {
  try {
    const stopIndex = stops.findIndex(s => s.id === parseInt(stopId) && s.user_id === userId);
    
    if (stopIndex === -1) {
      return {
        success: false,
        message: 'Stop not found or unauthorized'
      };
    }

    const stop = stops[stopIndex];

    if (data.city !== undefined) stop.city = data.city;
    if (data.country !== undefined) stop.country = data.country;
    if (data.arrival_date !== undefined) stop.arrival_date = data.arrival_date;
    if (data.departure_date !== undefined) stop.departure_date = data.departure_date;
    if (data.accommodation !== undefined) stop.accommodation = data.accommodation;
    if (data.notes !== undefined) stop.notes = data.notes;
    
    stop.updated_at = new Date().toISOString();
    stops[stopIndex] = stop;

    return {
      success: true,
      message: 'Stop updated successfully',
      data: stop
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error updating stop',
      error: error.message
    };
  }
};

// ===== DELETE STOP =====
const deleteStop = (stopId, userId) => {
  try {
    const stopIndex = stops.findIndex(s => s.id === parseInt(stopId) && s.user_id === userId);
    
    if (stopIndex === -1) {
      return {
        success: false,
        message: 'Stop not found or unauthorized'
      };
    }

    const deletedStop = stops.splice(stopIndex, 1);

    return {
      success: true,
      message: 'Stop deleted successfully',
      data: deletedStop[0]
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error deleting stop',
      error: error.message
    };
  }
};

module.exports = {
  createStop,
  getStopsByTrip,
  getStopById,
  updateStop,
  deleteStop
};
