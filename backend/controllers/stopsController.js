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

const findCity = async (cityName, country) => {
  if (!cityName) return null;

  return prisma.city.findFirst({
    where: {
      name: { equals: String(cityName).trim(), mode: 'insensitive' },
      ...(country ? { country: { equals: String(country).trim(), mode: 'insensitive' } } : {})
    }
  });
};

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

    const trip = await getAccessibleTrip(tripId, userId);

    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized'
      };
    }

    const city = await findCity(data.city, data.country);
    const orderNumberResult = await prisma.tripStop.aggregate({
      where: { tripId: parseInt(tripId, 10) },
      _max: { orderNumber: true }
    });

    const stop = await prisma.tripStop.create({
      data: {
        tripId: parseInt(tripId, 10),
        cityId: city ? city.id : null,
        customCity: city ? null : data.city,
        customCountry: city ? null : (data.country || null),
        startDate: arrivalDate,
        endDate: departureDate,
        notes: data.notes || null,
        orderNumber: (orderNumberResult._max.orderNumber || 0) + 1
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
    const trip = await getAccessibleTrip(tripId, userId);

    if (!trip) {
      return {
        success: false,
        message: 'Trip not found or unauthorized',
        data: []
      };
    }

    const stops = await prisma.tripStop.findMany({
      where: { tripId: parseInt(tripId, 10) },
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
        tripNotes: true,
        expenses: true
      }
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
    const stop = await prisma.tripStop.findFirst({
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
        activities: {
          include: {
            cityActivity: {
              include: {
                city: true
              }
            }
          }
        },
        tripNotes: true,
        expenses: true
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
    const existingStop = await prisma.tripStop.findFirst({
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
        city: true
      }
    });
    
    if (!existingStop) {
      return {
        success: false,
        message: 'Stop not found or unauthorized'
      };
    }

    const updateData = {};
    if (data.city !== undefined || data.country !== undefined) {
      const city = await findCity(data.city || existingStop.customCity || existingStop.city?.name, data.country || existingStop.customCountry || existingStop.city?.country);
      updateData.cityId = city ? city.id : null;
      updateData.customCity = city ? null : (data.city !== undefined ? data.city : existingStop.customCity);
      updateData.customCountry = city ? null : (data.country !== undefined ? data.country : existingStop.customCountry);
    }
    if (data.arrival_date !== undefined) updateData.startDate = new Date(data.arrival_date);
    if (data.departure_date !== undefined) updateData.endDate = new Date(data.departure_date);
    if (data.notes !== undefined) updateData.notes = data.notes;

    const stop = await prisma.tripStop.update({
      where: { id: parseInt(stopId, 10) },
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
    const existingStop = await prisma.tripStop.findFirst({
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
    
    if (!existingStop) {
      return {
        success: false,
        message: 'Stop not found or unauthorized'
      };
    }

    const deletedStop = await prisma.tripStop.delete({
      where: { id: parseInt(stopId, 10) }
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
};
module.exports = {
  createStop,
  getStopsByTrip,
  getStopById,
  updateStop,
  deleteStop
};
