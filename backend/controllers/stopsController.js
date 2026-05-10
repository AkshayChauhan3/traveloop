// Mock database for stops (cities/locations in a trip)
let stops = [];
let stopIdCounter = 1;

// ===== CREATE STOP =====
const createStop = async (data, tripId, userId) => {
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

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Verify trip belongs to user
    const trip = await prisma.trip.findFirst({
      where: { id: parseInt(tripId), userId }
    });

    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const stop = await prisma.stop.create({
      data: {
        tripId: parseInt(tripId),
        userId,
        city: data.city,
        country: data.country || null,
        arrivalDate,
        departureDate,
        accommodation: data.accommodation || null,
        notes: data.notes || null
      }
    });

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
const getStopsByTrip = async (tripId, userId) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Verify trip belongs to user
    const trip = await prisma.trip.findFirst({
      where: { id: parseInt(tripId), userId }
    });

    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized',
        data: []
      };
    }

    const stops = await prisma.stop.findMany({
      where: { tripId: parseInt(tripId), userId }
    });

    return {
      success: true,
      data: stops
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching stops',
      error: error.message,
      data: []
    };
  }
};

// ===== GET SINGLE STOP =====
const getStopById = async (stopId, userId) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const stop = await prisma.stop.findFirst({
      where: {
        id: parseInt(stopId),
        userId
      }
    });
    
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
const updateStop = async (stopId, data, userId) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // First check if stop exists and belongs to user
    const existingStop = await prisma.stop.findFirst({
      where: {
        id: parseInt(stopId),
        userId
      }
    });
    
    if (!existingStop) {
      return {
        success: false,
        message: 'Stop not found or unauthorized'
      };
    }

    const updateData = {};
    if (data.city !== undefined) updateData.city = data.city;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.arrival_date !== undefined) updateData.arrivalDate = new Date(data.arrival_date);
    if (data.departure_date !== undefined) updateData.departureDate = new Date(data.departure_date);
    if (data.accommodation !== undefined) updateData.accommodation = data.accommodation;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const stop = await prisma.stop.update({
      where: { id: parseInt(stopId) },
      data: updateData
    });

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
const deleteStop = async (stopId, userId) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // First check if stop exists and belongs to user
    const existingStop = await prisma.stop.findFirst({
      where: {
        id: parseInt(stopId),
        userId
      }
    });
    
    if (!existingStop) {
      return {
        success: false,
        message: 'Stop not found or unauthorized'
      };
    }

    const deletedStop = await prisma.stop.delete({
      where: { id: parseInt(stopId) }
    });

    return {
      success: true,
      message: 'Stop deleted successfully',
      data: deletedStop
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error deleting stop',
      error: error.message
    };
  }
module.exports = {
  createStop,
  getStopsByTrip,
  getStopById,
  updateStop,
  deleteStop
};
