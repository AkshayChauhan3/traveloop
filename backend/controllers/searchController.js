// ===== SEARCH CITIES =====
const searchCities = (query) => {
  try {
    if (!query || query.trim() === '') {
      return {
        success: false,
        message: 'Search query required'
      };
    }

    // TODO: DATABASE TEAM - Replace with real query from 'cities' table
    const citiesDatabase = [
      {
        id: 1,
        name: 'Paris',
        country: 'France',
        average_daily_cost: 100,
        best_season: 'April-May, September-October',
        language: 'French',
        currency: 'EUR',
        vibe: 'romantic, artistic, historic'
      },
      {
        id: 2,
        name: 'Tokyo',
        country: 'Japan',
        average_daily_cost: 120,
        best_season: 'March-May, September-November',
        language: 'Japanese',
        currency: 'JPY',
        vibe: 'modern, bustling, innovative'
      },
      {
        id: 3,
        name: 'Barcelona',
        country: 'Spain',
        average_daily_cost: 80,
        best_season: 'April-June, September-October',
        language: 'Spanish, Catalan',
        currency: 'EUR',
        vibe: 'vibrant, coastal, artistic'
      },
      {
        id: 4,
        name: 'New York',
        country: 'USA',
        average_daily_cost: 150,
        best_season: 'May, September-October',
        language: 'English',
        currency: 'USD',
        vibe: 'energetic, diverse, fast-paced'
      },
      {
        id: 5,
        name: 'Dubai',
        country: 'UAE',
        average_daily_cost: 130,
        best_season: 'November-March',
        language: 'Arabic, English',
        currency: 'AED',
        vibe: 'luxury, modern, shopping'
      },
      {
        id: 6,
        name: 'Amsterdam',
        country: 'Netherlands',
        average_daily_cost: 95,
        best_season: 'April-May, August-September',
        language: 'Dutch, English',
        currency: 'EUR',
        vibe: 'relaxed, bike-friendly, canal-filled'
      }
    ];

    const results = citiesDatabase.filter(city =>
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.country.toLowerCase().includes(query.toLowerCase())
    );

    return {
      success: true,
      data: results
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
const getCityDetails = (cityName) => {
  try {
    // TODO: DATABASE TEAM - Query from 'cities' table by name
    const citiesDatabase = {
      'Paris': {
        name: 'Paris',
        country: 'France',
        population: '2.1 million',
        average_daily_cost: 100,
        best_season: 'April-May, September-October',
        language: 'French',
        currency: 'EUR',
        attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Arc de Triomphe'],
        vibe: 'romantic, artistic, historic',
        description: 'The City of Light known for art, fashion, gastronomy, and culture.',
        tips: 'Visit in spring or fall for the best weather'
      },
      'Tokyo': {
        name: 'Tokyo',
        country: 'Japan',
        population: '37.4 million',
        average_daily_cost: 120,
        best_season: 'March-May, September-November',
        language: 'Japanese',
        currency: 'JPY',
        attractions: ['Senso-ji Temple', 'Tokyo Tower', 'Meiji Shrine', 'Shibuya Crossing'],
        vibe: 'modern, bustling, innovative',
        description: 'A unique blend of ancient tradition and cutting-edge technology.',
        tips: 'Get a Suica card for easy public transport'
      },
      'Barcelona': {
        name: 'Barcelona',
        country: 'Spain',
        population: '1.6 million',
        average_daily_cost: 80,
        best_season: 'April-June, September-October',
        language: 'Spanish, Catalan',
        currency: 'EUR',
        attractions: ['Sagrada Familia', 'Park Güell', 'Gothic Quarter', 'Las Ramblas'],
        vibe: 'vibrant, coastal, artistic',
        description: 'Gaudi masterpieces meet Mediterranean beaches and vibrant culture.',
        tips: 'Buy a T-Casual ticket for unlimited metro rides'
      }
    };

    const city = citiesDatabase[cityName];
    
    if (!city) {
      return {
        success: false,
        message: 'City not found'
      };
    }

    return {
      success: true,
      data: city
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
const searchActivities = (query) => {
  try {
    if (!query || query.trim() === '') {
      return {
        success: false,
        message: 'Search query required'
      };
    }

    // TODO: DATABASE TEAM - Query from 'activities' table
    const activitiesDatabase = [
      {
        id: 1,
        name: 'Eiffel Tower Visit',
        category: 'sightseeing',
        description: 'Visit the iconic Eiffel Tower',
        cost_range: '$20-$30',
        duration_hours: 2,
        popular_in: ['Paris'],
        rating: 4.8
      },
      {
        id: 2,
        name: 'Hiking',
        category: 'adventure',
        description: 'Outdoor hiking trails',
        cost_range: '$0-$50',
        duration_hours: 4,
        popular_in: ['Swiss Alps', 'Colorado', 'New Zealand'],
        rating: 4.7
      },
      {
        id: 3,
        name: 'Wine Tasting',
        category: 'food',
        description: 'Local wine tasting experience',
        cost_range: '$20-$100',
        duration_hours: 2,
        popular_in: ['Bordeaux', 'Napa Valley', 'Tuscany'],
        rating: 4.6
      },
      {
        id: 4,
        name: 'Scuba Diving',
        category: 'adventure',
        description: 'Underwater diving experience',
        cost_range: '$100-$300',
        duration_hours: 4,
        popular_in: ['Maldives', 'Great Barrier Reef', 'Bali'],
        rating: 4.9
      },
      {
        id: 5,
        name: 'Shopping Tour',
        category: 'shopping',
        description: 'Guided shopping experience',
        cost_range: '$50-$500+',
        duration_hours: 4,
        popular_in: ['Dubai', 'New York', 'Tokyo'],
        rating: 4.4
      }
    ];

    const results = activitiesDatabase.filter(activity =>
      activity.name.toLowerCase().includes(query.toLowerCase()) ||
      activity.description.toLowerCase().includes(query.toLowerCase())
    );

    return {
      success: true,
      data: results
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
const getTrendingDestinations = () => {
  try {
    // TODO: DATABASE TEAM - Add trending_score or views count to cities table
    const trending = [
      { rank: 1, name: 'Dubai', country: 'UAE', trend: '🔥 Hot', views: 15000 },
      { rank: 2, name: 'Bangkok', country: 'Thailand', trend: '🔥 Hot', views: 12000 },
      { rank: 3, name: 'Bali', country: 'Indonesia', trend: '🔥 Hot', views: 11000 },
      { rank: 4, name: 'Tokyo', country: 'Japan', trend: '📈 Rising', views: 9500 },
      { rank: 5, name: 'Paris', country: 'France', trend: 'Popular', views: 8500 }
    ];

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
const getDestinationRecommendations = (userId, preferences) => {
  try {
    // TODO: DATABASE TEAM - Implement AI-based recommendation logic
    const budget = preferences.budget || 5000;
    
    let recommended = [];
    
    if (budget < 2000) {
      recommended = [
        { city: 'Bangkok', match_score: 95, reasons: ['Budget-friendly', 'Street food', 'Culture'] },
        { city: 'Bali', match_score: 92, reasons: ['Affordable accommodation', 'Beaches', 'Nature'] }
      ];
    } else if (budget < 5000) {
      recommended = [
        { city: 'Barcelona', match_score: 90, reasons: ['Good value', 'Architecture', 'Beaches'] },
        { city: 'Tokyo', match_score: 88, reasons: ['Culture', 'Food', 'Innovation'] }
      ];
    } else {
      recommended = [
        { city: 'Paris', match_score: 95, reasons: ['Luxury', 'Art', 'Romance'] },
        { city: 'New York', match_score: 92, reasons: ['Diversity', 'Entertainment', 'Shopping'] }
      ];
    }

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
