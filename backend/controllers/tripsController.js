const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===== CREATE TRIP =====
const createTrip = async (data, userId) => {
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

    const trip = await prisma.trip.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        startDate,
        endDate,
        totalBudget: parseFloat(data.total_budget),
        status: data.status || 'planned'
      }
    });

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
const getUserTrips = async (userId) => {
  try {
    const userTrips = await prisma.trip.findMany({
      where: { userId }
    });

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
const getTripById = async (tripId, userId) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: parseInt(tripId),
        userId
      }
    });
    
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
const updateTrip = async (tripId, data, userId) => {
  try {
    // First check if trip exists and belongs to user
    const existingTrip = await prisma.trip.findFirst({
      where: {
        id: parseInt(tripId),
        userId
      }
    });
    
    if (!existingTrip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.start_date !== undefined) updateData.startDate = new Date(data.start_date);
    if (data.end_date !== undefined) updateData.endDate = new Date(data.end_date);
    if (data.total_budget !== undefined) updateData.totalBudget = parseFloat(data.total_budget);
    if (data.status !== undefined) updateData.status = data.status;

    const trip = await prisma.trip.update({
      where: { id: parseInt(tripId) },
      data: updateData
    });

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
const deleteTrip = async (tripId, userId) => {
  try {
    // First check if trip exists and belongs to user
    const existingTrip = await prisma.trip.findFirst({
      where: {
        id: parseInt(tripId),
        userId
      }
    });
    
    if (!existingTrip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const deletedTrip = await prisma.trip.delete({
      where: { id: parseInt(tripId) }
    });

    return {
      success: true,
      message: 'Trip deleted successfully',
      data: deletedTrip
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
