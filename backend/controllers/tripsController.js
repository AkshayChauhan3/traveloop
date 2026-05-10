const prisma = require('../lib/prisma');
const crypto = require('crypto');

const TRIP_STATUSES = new Set(['PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED']);

const parseBoolean = (value) => {
  if (value === true || value === false) return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return Boolean(value);
};

const normalizeTripStatus = (status) => {
  if (status === undefined || status === null || status === '') {
    return undefined;
  }

  const normalized = String(status).trim().toUpperCase();
  return TRIP_STATUSES.has(normalized) ? normalized : undefined;
};

const getTripTitle = (data) => data.title || data.name;
const getTripBudget = (data) => data.budget ?? data.total_budget;
const generateShareSlug = () => crypto.randomBytes(6).toString('hex');

const getTripWhereClause = (tripId, userId) => ({
  id: parseInt(tripId, 10),
  OR: [
    { userId },
    { members: { some: { userId } } }
  ]
});

// ===== CREATE TRIP =====
const createTrip = async (data, userId) => {
  try {
    const title = getTripTitle(data);
    const budget = getTripBudget(data);
    const startDateValue = data.startDate || data.start_date;
    const endDateValue = data.endDate || data.end_date;
    const status = normalizeTripStatus(data.status) || 'PLANNED';

    if (!title || !data.description || !startDateValue || !endDateValue || budget === undefined || budget === null || budget === '') {
      return {
        success: false,
        message: 'Missing required fields: title/name, description, start_date/end_date, total_budget/budget'
      };
    }

    // Validate dates
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    if (startDate >= endDate) {
      return {
        success: false,
        message: 'End date must be after start date'
      };
    }

    const trip = await prisma.$transaction(async (tx) => {
      const createdTrip = await tx.trip.create({
        data: {
          userId,
          title,
          description: data.description,
          startDate,
          endDate,
          budget: parseFloat(budget),
          status,
          isPublic: parseBoolean(data.is_public ?? data.isPublic),
          shareSlug: generateShareSlug()
        }
      });

      await tx.tripMember.create({
        data: {
          tripId: createdTrip.id,
          userId,
          role: 'OWNER'
        }
      });

      return createdTrip;
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
      where: {
        OR: [
          { userId },
          { members: { some: { userId } } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        members: true,
        stops: {
          orderBy: { orderNumber: 'asc' }
        }
      }
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
      where: getTripWhereClause(tripId, userId),
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePhoto: true
              }
            }
          }
        },
        stops: {
          orderBy: { orderNumber: 'asc' },
          include: {
            city: true,
            activities: {
              include: {
                cityActivity: {
                  include: {
                    city: true
                  }
                }
              }
            },
            expenses: true
          }
        },
        expenses: true,
        packingItems: true,
        notes: true
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
    const existingTrip = await prisma.trip.findFirst({
      where: getTripWhereClause(tripId, userId)
    });
    
    if (!existingTrip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const updateData = {};
    if (data.title !== undefined || data.name !== undefined) updateData.title = getTripTitle(data);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.startDate !== undefined || data.start_date !== undefined) updateData.startDate = new Date(data.startDate || data.start_date);
    if (data.endDate !== undefined || data.end_date !== undefined) updateData.endDate = new Date(data.endDate || data.end_date);
    if (data.budget !== undefined || data.total_budget !== undefined) updateData.budget = parseFloat(getTripBudget(data));
    const status = normalizeTripStatus(data.status);
    if (status !== undefined) updateData.status = status;

    const trip = await prisma.trip.update({
      where: { id: parseInt(tripId, 10) },
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
    const existingTrip = await prisma.trip.findFirst({
      where: getTripWhereClause(tripId, userId)
    });
    
    if (!existingTrip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const deletedTrip = await prisma.trip.delete({
      where: { id: parseInt(tripId, 10) }
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
