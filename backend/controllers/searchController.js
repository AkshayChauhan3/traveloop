const prisma = require('../lib/prisma');

const mapCity = (city) => ({
  id: city.id,
  name: city.name,
  country: city.country,
  description: city.description,
  population: city.population,
  average_daily_cost: city.averageDailyCost,
  best_season: city.bestSeason,
  language: city.language,
  currency: city.currency,
  vibe: city.vibe,
  imageUrl: city.imageUrl,
  latitude: city.latitude,
  longitude: city.longitude,
  attractions_count: city._count?.attractions || 0,
  activities_count: city._count?.activities || 0
});

const mapCityDetails = (city) => ({
  id: city.id,
  name: city.name,
  country: city.country,
  population: city.population,
  average_daily_cost: city.averageDailyCost,
  best_season: city.bestSeason,
  language: city.language,
  currency: city.currency,
  vibe: city.vibe,
  description: city.description,
  imageUrl: city.imageUrl,
  latitude: city.latitude,
  longitude: city.longitude,
  attractions: city.attractions.map((attraction) => ({
    id: attraction.id,
    name: attraction.name,
    description: attraction.description,
    imageUrl: attraction.imageUrl,
    ticketPrice: attraction.ticketPrice,
    availabilityTime: attraction.availabilityTime
  })),
  activities: city.activities.map((activity) => ({
    id: activity.id,
    name: activity.name,
    category: activity.category,
    description: activity.description,
    duration: activity.duration,
    price: activity.price,
    costRange: activity.costRange,
    imageUrl: activity.imageUrl,
    availabilityTime: activity.availabilityTime
  }))
});

// ===== SEARCH CITIES =====
const searchCities = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return {
        success: false,
        message: 'Search query required'
      };
    }

    const results = await prisma.city.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { vibe: { contains: query, mode: 'insensitive' } },
          { language: { contains: query, mode: 'insensitive' } },
          { bestSeason: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            attractions: true,
            activities: true
          }
        }
      }
    });

    return {
      success: true,
      data: results.map(mapCity)
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error searching cities',
      error: error.message
    };
  }
};

// ===== GET CITY DETAILS =====
const getCityDetails = async (cityName) => {
  try {
    const city = await prisma.city.findFirst({
      where: {
        name: { equals: cityName, mode: 'insensitive' }
      },
      include: {
        attractions: true,
        activities: true
      }
    });
    
    if (!city) {
      return {
        success: false,
        message: 'City not found'
      };
    }

    return {
      success: true,
      data: mapCityDetails(city)
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching city details',
      error: error.message
    };
  }
};

// ===== SEARCH ACTIVITIES =====
const searchActivities = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return {
        success: false,
        message: 'Search query required'
      };
    }

    const results = await prisma.cityActivity.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { costRange: { contains: query, mode: 'insensitive' } },
          { duration: { contains: query, mode: 'insensitive' } },
          { availabilityTime: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        city: true
      },
      orderBy: { name: 'asc' }
    });

    return {
      success: true,
      data: results.map((activity) => ({
        id: activity.id,
        name: activity.name,
        category: activity.category,
        description: activity.description,
        cost_range: activity.costRange,
        duration: activity.duration,
        price: activity.price,
        availability_time: activity.availabilityTime,
        city: activity.city ? {
          id: activity.city.id,
          name: activity.city.name,
          country: activity.city.country
        } : null
      }))
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error searching activities',
      error: error.message
    };
  }
};

// ===== GET TRENDING DESTINATIONS =====
const getTrendingDestinations = async () => {
  try {
    const cities = await prisma.city.findMany({
      include: {
        _count: {
          select: {
            attractions: true,
            activities: true
          }
        }
      }
    });

    const trending = cities
      .map((city) => ({
        id: city.id,
        name: city.name,
        country: city.country,
        views: (city._count.attractions * 1000) + (city._count.activities * 750),
        score: city._count.attractions + city._count.activities
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((city, index) => ({
        rank: index + 1,
        name: city.name,
        country: city.country,
        trend: index < 2 ? '🔥 Hot' : 'Popular',
        views: city.views
      }));

    return {
      success: true,
      data: trending
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching trending destinations',
      error: error.message
    };
  }
};

// ===== GET RECOMMENDATIONS =====
const getDestinationRecommendations = async (userId, preferences) => {
  try {
    const budget = preferences.budget || 5000;
    const durationDays = preferences.duration_days || 7;
    const dailyBudget = budget / durationDays;
    const interests = (preferences.interests || []).map((item) => String(item).trim().toLowerCase()).filter(Boolean);

    const cities = await prisma.city.findMany({
      include: {
        _count: {
          select: {
            attractions: true,
            activities: true
          }
        }
      }
    });

    const recommended = cities
      .map((city) => {
        const vibe = String(city.vibe || '').toLowerCase();
        const country = String(city.country || '').toLowerCase();
        const matchScoreBase = Math.max(0, 100 - Math.abs((city.averageDailyCost || dailyBudget) - dailyBudget) * 2);
        const interestBonus = interests.reduce((score, interest) => {
          if (vibe.includes(interest) || country.includes(interest) || String(city.name).toLowerCase().includes(interest)) {
            return score + 5;
          }
          return score;
        }, 0);

        return {
          city: city.name,
          match_score: Math.min(100, Math.round(matchScoreBase + interestBonus + (city._count.activities > 0 ? 3 : 0))),
          reasons: [
            city.averageDailyCost && city.averageDailyCost <= dailyBudget ? 'Fits budget' : 'Stretch budget',
            city.vibe || 'Travel destination',
            `${city._count.activities} activities in database`
          ]
        };
      })
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5);

    return {
      success: true,
      data: recommended
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error generating recommendations',
      error: error.message
    };
  }
};

module.exports = {
  searchCities,
  getCityDetails,
  searchActivities,
  getTrendingDestinations,
  getDestinationRecommendations
};
