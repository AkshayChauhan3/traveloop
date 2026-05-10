const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const cities = [
    // --- 25 Indian Cities ---
    {
      name: "Mumbai",
      country: "India",
      description: "The city of dreams and Bollywood",
      population: "12.5M",
      averageDailyCost: 40.0,
      bestSeason: "October-March",
      language: "Marathi, Hindi",
      currency: "INR",
      vibe: "bustling",
      imageUrl: "https://example.com/mumbai.jpg",
      latitude: 18.922,
      longitude: 72.8347,
      attractions: {
        create: [
          { name: "Gateway of India", description: "Iconic arch monument", imageUrl: "https://example.com/gateway.jpg" },
          { name: "Marine Drive", description: "C-shaped boulevard along the coast", imageUrl: "https://example.com/marine.jpg" },
          { name: "Elephanta Caves", description: "Ancient cave temples", imageUrl: "https://example.com/elephanta.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Dharavi Slum Tour", price: 15.0, duration: "2 hours", category: "CULTURE" },
          { name: "Bollywood Studio Tour", price: 50.0, duration: "Half day", category: "NIGHTLIFE" },
          { name: "Street Food Tasting", price: 10.0, duration: "2 hours", category: "FOOD" }
        ]
      }
    },
    {
      name: "Delhi",
      country: "India",
      description: "A blend of rich history and vibrant modern life",
      population: "11.0M",
      averageDailyCost: 35.0,
      bestSeason: "October-March",
      language: "Hindi",
      currency: "INR",
      vibe: "historic",
      imageUrl: "https://example.com/delhi.jpg",
      latitude: 28.6139,
      longitude: 77.209,
      attractions: {
        create: [
          { name: "Red Fort", description: "Historic fort complex", imageUrl: "https://example.com/redfort.jpg" },
          { name: "India Gate", description: "War memorial arch", imageUrl: "https://example.com/indiagate.jpg" },
          { name: "Qutub Minar", description: "Tallest brick minaret in the world", imageUrl: "https://example.com/qutub.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Old Delhi Rickshaw Ride", price: 12.0, duration: "1.5 hours", category: "NATURE" },
          { name: "Food Walk in Chandni Chowk", price: 18.0, duration: "3 hours", category: "FOOD" },
          { name: "Akshardham Temple Visit", price: 0.0, duration: "Half day", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Bengaluru",
      country: "India",
      description: "The Silicon Valley of India with lush parks",
      population: "8.4M",
      averageDailyCost: 40.0,
      bestSeason: "September-February",
      language: "Kannada",
      currency: "INR",
      vibe: "modern",
      imageUrl: "https://example.com/bengaluru.jpg",
      latitude: 12.9716,
      longitude: 77.5946,
      attractions: {
        create: [
          { name: "Lalbagh Botanical Garden", description: "Historic botanical garden", imageUrl: "https://example.com/lalbagh.jpg" },
          { name: "Bangalore Palace", description: "Tudor-style royal palace", imageUrl: "https://example.com/palace.jpg" },
          { name: "Cubbon Park", description: "Major lung space of the city", imageUrl: "https://example.com/cubbon.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Pub Crawl in Indiranagar", price: 25.0, duration: "4 hours", category: "NIGHTLIFE" },
          { name: "Nandi Hills Sunrise Trek", price: 20.0, duration: "Half day", category: "ADVENTURE" },
          { name: "Tech Park Tour", price: 10.0, duration: "2 hours", category: "NATURE" }
        ]
      }
    },
    {
      name: "Jaipur",
      country: "India",
      description: "The Pink City famous for its royal palaces",
      population: "3.0M",
      averageDailyCost: 30.0,
      bestSeason: "October-March",
      language: "Hindi, Rajasthani",
      currency: "INR",
      vibe: "cultural",
      imageUrl: "https://example.com/jaipur.jpg",
      latitude: 26.9124,
      longitude: 75.7873,
      attractions: {
        create: [
          { name: "Amber Fort", description: "Majestic hilltop fort", imageUrl: "https://example.com/amber.jpg" },
          { name: "Hawa Mahal", description: "Palace of Winds", imageUrl: "https://example.com/hawa.jpg" },
          { name: "City Palace", description: "Royal residence and museum", imageUrl: "https://example.com/citypalace.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Hot Air Balloon Ride", price: 150.0, duration: "2 hours", category: "ADVENTURE" },
          { name: "Block Printing Workshop", price: 20.0, duration: "3 hours", category: "CULTURE" },
          { name: "Chokhi Dhani Dinner", price: 15.0, duration: "Evening", category: "FOOD" }
        ]
      }
    },
    {
      name: "Goa",
      country: "India",
      description: "Famous for its pristine beaches and nightlife",
      population: "1.5M",
      averageDailyCost: 50.0,
      bestSeason: "November-February",
      language: "Konkani",
      currency: "INR",
      vibe: "relaxed",
      imageUrl: "https://example.com/goa.jpg",
      latitude: 15.2993,
      longitude: 74.124,
      attractions: {
        create: [
          { name: "Baga Beach", description: "Popular bustling beach", imageUrl: "https://example.com/baga.jpg" },
          { name: "Basilica of Bom Jesus", description: "UNESCO World Heritage site", imageUrl: "https://example.com/basilica.jpg" },
          { name: "Dudhsagar Waterfalls", description: "Four-tiered waterfall", imageUrl: "https://example.com/dudhsagar.jpg" },
          { name: "Aguada Fort", description: "17th-century Portuguese fort", imageUrl: "https://example.com/aguada.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Scuba Diving", price: 40.0, duration: "Half day", category: "ADVENTURE" },
          { name: "Mandovi River Cruise", price: 10.0, duration: "2 hours", category: "NATURE" },
          { name: "Spice Plantation Tour", price: 15.0, duration: "3 hours", category: "NATURE" }
        ]
      }
    },
    {
      name: "Udaipur",
      country: "India",
      description: "The City of Lakes with a romantic atmosphere",
      population: "450K",
      averageDailyCost: 35.0,
      bestSeason: "September-March",
      language: "Hindi",
      currency: "INR",
      vibe: "romantic",
      imageUrl: "https://example.com/udaipur.jpg",
      latitude: 24.5854,
      longitude: 73.7125,
      attractions: {
        create: [
          { name: "City Palace", description: "Overlooking Lake Pichola", imageUrl: "https://example.com/udcity.jpg" },
          { name: "Lake Palace", description: "Iconic island palace", imageUrl: "https://example.com/lakepalace.jpg" },
          { name: "Jag Mandir", description: "Palace built on an island", imageUrl: "https://example.com/jag.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Boat Ride on Lake Pichola", price: 10.0, duration: "1 hour", category: "NATURE" },
          { name: "Dharohar Folk Dance Show", price: 5.0, duration: "Evening", category: "NIGHTLIFE" },
          { name: "Sajjangarh Sunset Visit", price: 8.0, duration: "2 hours", category: "NATURE" }
        ]
      }
    },
    {
      name: "Varanasi",
      country: "India",
      description: "The spiritual capital of India on the Ganges",
      population: "1.2M",
      averageDailyCost: 20.0,
      bestSeason: "October-March",
      language: "Hindi",
      currency: "INR",
      vibe: "spiritual",
      imageUrl: "https://example.com/varanasi.jpg",
      latitude: 25.3176,
      longitude: 82.9739,
      attractions: {
        create: [
          { name: "Kashi Vishwanath Temple", description: "Famous Hindu temple", imageUrl: "https://example.com/kashi.jpg" },
          { name: "Dashashwamedh Ghat", description: "Main ghat on the Ganges", imageUrl: "https://example.com/ghat.jpg" },
          { name: "Sarnath", description: "Buddhist pilgrimage site", imageUrl: "https://example.com/sarnath.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Ganga Aarti Ceremony", price: 0.0, duration: "Evening", category: "CULTURE" },
          { name: "Morning Boat Ride", price: 8.0, duration: "1.5 hours", category: "NATURE" },
          { name: "Silk Weaving Village Tour", price: 12.0, duration: "3 hours", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Agra",
      country: "India",
      description: "Home to the magnificent Taj Mahal",
      population: "1.6M",
      averageDailyCost: 25.0,
      bestSeason: "October-March",
      language: "Hindi",
      currency: "INR",
      vibe: "historic",
      imageUrl: "https://example.com/agra.jpg",
      latitude: 27.1767,
      longitude: 78.0081,
      attractions: {
        create: [
          { name: "Taj Mahal", description: "Ivory-white marble mausoleum", imageUrl: "https://example.com/taj.jpg" },
          { name: "Agra Fort", description: "Historical fort", imageUrl: "https://example.com/agrafort.jpg" },
          { name: "Fatehpur Sikri", description: "Abandoned Mughal city", imageUrl: "https://example.com/fatehpur.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Sunrise Taj Mahal Tour", price: 25.0, duration: "3 hours", category: "NATURE" },
          { name: "Mughal Heritage Walk", price: 15.0, duration: "2 hours", category: "CULTURE" },
          { name: "Marble Inlay Workshop", price: 10.0, duration: "1.5 hours", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Kolkata",
      country: "India",
      description: "The cultural capital known for its art and literature",
      population: "4.5M",
      averageDailyCost: 25.0,
      bestSeason: "October-March",
      language: "Bengali",
      currency: "INR",
      vibe: "cultural",
      imageUrl: "https://example.com/kolkata.jpg",
      latitude: 22.5726,
      longitude: 88.3639,
      attractions: {
        create: [
          { name: "Victoria Memorial", description: "Large marble building", imageUrl: "https://example.com/victoria.jpg" },
          { name: "Howrah Bridge", description: "Iconic cantilever bridge", imageUrl: "https://example.com/howrah.jpg" },
          { name: "Dakshineswar Kali Temple", description: "Hindu temple on the Hooghly", imageUrl: "https://example.com/dakshineswar.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Tram Ride through Heritage Areas", price: 2.0, duration: "1 hour", category: "CULTURE" },
          { name: "Bengali Sweets Tasting", price: 8.0, duration: "2 hours", category: "FOOD" },
          { name: "Sundarbans Day Trip", price: 60.0, duration: "Full day", category: "NATURE" }
        ]
      }
    },
    {
      name: "Chennai",
      country: "India",
      description: "Gateway to South India with beautiful temples",
      population: "7.0M",
      averageDailyCost: 30.0,
      bestSeason: "November-February",
      language: "Tamil",
      currency: "INR",
      vibe: "traditional",
      imageUrl: "https://example.com/chennai.jpg",
      latitude: 13.0827,
      longitude: 80.2707,
      attractions: {
        create: [
          { name: "Marina Beach", description: "Longest natural urban beach", imageUrl: "https://example.com/marina.jpg" },
          { name: "Kapaleeshwarar Temple", description: "Dravidian architectural temple", imageUrl: "https://example.com/kapaleeshwarar.jpg" },
          { name: "Fort St. George", description: "First English fortress in India", imageUrl: "https://example.com/fort.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "South Indian Food Tour", price: 15.0, duration: "3 hours", category: "FOOD" },
          { name: "Mahabalipuram Excursion", price: 30.0, duration: "Half day", category: "CULTURE" },
          { name: "Silk Sari Shopping Walk", price: 5.0, duration: "2 hours", category: "RELAXATION" }
        ]
      }
    },
    {
      name: "Hyderabad",
      country: "India",
      description: "City of pearls and delicious biryani",
      population: "6.9M",
      averageDailyCost: 30.0,
      bestSeason: "October-March",
      language: "Telugu, Urdu",
      currency: "INR",
      vibe: "historic",
      imageUrl: "https://example.com/hyderabad.jpg",
      latitude: 17.385,
      longitude: 78.4867,
      attractions: {
        create: [
          { name: "Charminar", description: "Global icon of Hyderabad", imageUrl: "https://example.com/charminar.jpg" },
          { name: "Golconda Fort", description: "Ruined city and fortress", imageUrl: "https://example.com/golconda.jpg" },
          { name: "Ramoji Film City", description: "Massive film studio complex", imageUrl: "https://example.com/ramoji.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Biryani Tasting Tour", price: 12.0, duration: "2 hours", category: "FOOD" },
          { name: "Laad Bazaar Pearl Shopping", price: 0.0, duration: "2 hours", category: "RELAXATION" },
          { name: "Hussain Sagar Boat Ride", price: 5.0, duration: "1 hour", category: "NATURE" }
        ]
      }
    },
    {
      name: "Kochi",
      country: "India",
      description: "A coastal city blending colonial history and art",
      population: "600K",
      averageDailyCost: 35.0,
      bestSeason: "October-March",
      language: "Malayalam",
      currency: "INR",
      vibe: "relaxed",
      imageUrl: "https://example.com/kochi.jpg",
      latitude: 9.9312,
      longitude: 76.2673,
      attractions: {
        create: [
          { name: "Chinese Fishing Nets", description: "Iconic shore-operated lift nets", imageUrl: "https://example.com/nets.jpg" },
          { name: "Mattancherry Palace", description: "Portuguese palace", imageUrl: "https://example.com/mattancherry.jpg" },
          { name: "Fort Kochi Beach", description: "Historic beach area", imageUrl: "https://example.com/fortkochi.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Kathakali Dance Performance", price: 10.0, duration: "Evening", category: "NIGHTLIFE" },
          { name: "Kerala Backwaters Cruise", price: 40.0, duration: "Half day", category: "NATURE" },
          { name: "Spice Market Walking Tour", price: 8.0, duration: "2 hours", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Pune",
      country: "India",
      description: "A youthful city with a rich Maratha history",
      population: "3.1M",
      averageDailyCost: 30.0,
      bestSeason: "October-February",
      language: "Marathi",
      currency: "INR",
      vibe: "youthful",
      imageUrl: "https://example.com/pune.jpg",
      latitude: 18.5204,
      longitude: 73.8567,
      attractions: {
        create: [
          { name: "Shaniwar Wada", description: "Historical fortification", imageUrl: "https://example.com/shaniwar.jpg" },
          { name: "Aga Khan Palace", description: "Majestic palace and memorial", imageUrl: "https://example.com/agakhan.jpg" },
          { name: "Sinhagad Fort", description: "Hill fortress", imageUrl: "https://example.com/sinhagad.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Osho Ashram Visit", price: 15.0, duration: "Half day", category: "RELAXATION" },
          { name: "Trek to Sinhagad", price: 10.0, duration: "Half day", category: "ADVENTURE" },
          { name: "Koregaon Park Cafe Hopping", price: 20.0, duration: "Evening", category: "FOOD" }
        ]
      }
    },
    {
      name: "Rishikesh",
      country: "India",
      description: "Yoga capital of the world",
      population: "100K",
      averageDailyCost: 20.0,
      bestSeason: "September-November",
      language: "Hindi",
      currency: "INR",
      vibe: "spiritual",
      imageUrl: "https://example.com/rishikesh.jpg",
      latitude: 30.0869,
      longitude: 78.2676,
      attractions: {
        create: [
          { name: "Lakshman Jhula", description: "Iron suspension bridge", imageUrl: "https://example.com/jhula.jpg" },
          { name: "Triveni Ghat", description: "Sacred bathing spot", imageUrl: "https://example.com/triveni.jpg" },
          { name: "Beatles Ashram", description: "Historic ashram site", imageUrl: "https://example.com/beatles.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "White Water Rafting", price: 25.0, duration: "3 hours", category: "ADVENTURE" },
          { name: "Yoga and Meditation Class", price: 10.0, duration: "2 hours", category: "RELAXATION" },
          { name: "Bungee Jumping", price: 50.0, duration: "Half day", category: "ADVENTURE" }
        ]
      }
    },
    {
      name: "Munnar",
      country: "India",
      description: "Lush green hill station famous for tea estates",
      population: "32K",
      averageDailyCost: 35.0,
      bestSeason: "September-March",
      language: "Malayalam",
      currency: "INR",
      vibe: "scenic",
      imageUrl: "https://example.com/munnar.jpg",
      latitude: 10.0889,
      longitude: 77.0595,
      attractions: {
        create: [
          { name: "Tea Gardens", description: "Sprawling green tea estates", imageUrl: "https://example.com/teagarden.jpg" },
          { name: "Eravikulam National Park", description: "Home to the Nilgiri Tahr", imageUrl: "https://example.com/eravikulam.jpg" },
          { name: "Mattupetty Dam", description: "Concrete gravity dam", imageUrl: "https://example.com/dam.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Tea Factory Tour", price: 5.0, duration: "1.5 hours", category: "CULTURE" },
          { name: "Trekking in Western Ghats", price: 20.0, duration: "Half day", category: "ADVENTURE" },
          { name: "Elephant Safari", price: 15.0, duration: "1 hour", category: "NATURE" }
        ]
      }
    },
    {
      name: "Darjeeling",
      country: "India",
      description: "Queen of the Himalayas with stunning views",
      population: "132K",
      averageDailyCost: 30.0,
      bestSeason: "April-June",
      language: "Bengali, Nepali",
      currency: "INR",
      vibe: "scenic",
      imageUrl: "https://example.com/darjeeling.jpg",
      latitude: 27.036,
      longitude: 88.2627,
      attractions: {
        create: [
          { name: "Tiger Hill", description: "Viewpoint for Mount Kanchenjunga", imageUrl: "https://example.com/tigerhill.jpg" },
          { name: "Batasia Loop", description: "Spiral railway track", imageUrl: "https://example.com/batasia.jpg" },
          { name: "Peace Pagoda", description: "Buddhist stupa", imageUrl: "https://example.com/pagoda.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Toy Train Ride", price: 15.0, duration: "2 hours", category: "NATURE" },
          { name: "Tea Estate Tasting", price: 10.0, duration: "2 hours", category: "FOOD" },
          { name: "Himalayan Mountaineering Hike", price: 25.0, duration: "Half day", category: "ADVENTURE" }
        ]
      }
    },
    {
      name: "Jodhpur",
      country: "India",
      description: "The Blue City near the Thar Desert",
      population: "1.1M",
      averageDailyCost: 30.0,
      bestSeason: "October-March",
      language: "Hindi, Rajasthani",
      currency: "INR",
      vibe: "historic",
      imageUrl: "https://example.com/jodhpur.jpg",
      latitude: 26.2389,
      longitude: 73.0243,
      attractions: {
        create: [
          { name: "Mehrangarh Fort", description: "Massive hill fort", imageUrl: "https://example.com/mehrangarh.jpg" },
          { name: "Umaid Bhawan Palace", description: "Grand royal residence", imageUrl: "https://example.com/umaid.jpg" },
          { name: "Jaswant Thada", description: "Marble cenotaph", imageUrl: "https://example.com/jaswant.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Desert Safari", price: 35.0, duration: "Half day", category: "ADVENTURE" },
          { name: "Zip-lining at the Fort", price: 20.0, duration: "1.5 hours", category: "ADVENTURE" },
          { name: "Blue City Walking Tour", price: 12.0, duration: "2 hours", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Amritsar",
      country: "India",
      description: "Home to the glorious Golden Temple",
      population: "1.1M",
      averageDailyCost: 25.0,
      bestSeason: "November-March",
      language: "Punjabi",
      currency: "INR",
      vibe: "spiritual",
      imageUrl: "https://example.com/amritsar.jpg",
      latitude: 31.634,
      longitude: 74.8723,
      attractions: {
        create: [
          { name: "Golden Temple", description: "Holiest Gurdwara of Sikhism", imageUrl: "https://example.com/golden.jpg" },
          { name: "Jallianwala Bagh", description: "Historic memorial garden", imageUrl: "https://example.com/jallianwala.jpg" },
          { name: "Wagah Border", description: "India-Pakistan border crossing", imageUrl: "https://example.com/wagah.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Langar Volunteering", price: 0.0, duration: "2 hours", category: "CULTURE" },
          { name: "Wagah Border Ceremony", price: 0.0, duration: "Evening", category: "CULTURE" },
          { name: "Punjabi Dhaba Food Walk", price: 10.0, duration: "2 hours", category: "FOOD" }
        ]
      }
    },
    {
      name: "Mysuru",
      country: "India",
      description: "A heritage city known for its grand palace",
      population: "920K",
      averageDailyCost: 25.0,
      bestSeason: "October-February",
      language: "Kannada",
      currency: "INR",
      vibe: "heritage",
      imageUrl: "https://example.com/mysuru.jpg",
      latitude: 12.2958,
      longitude: 76.6394,
      attractions: {
        create: [
          { name: "Mysore Palace", description: "Indo-Saracenic royal palace", imageUrl: "https://example.com/mysorepalace.jpg" },
          { name: "Chamundeshwari Temple", description: "Hilltop Hindu temple", imageUrl: "https://example.com/chamundi.jpg" },
          { name: "Brindavan Gardens", description: "Terraced gardens with fountains", imageUrl: "https://example.com/brindavan.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Silk Weaving Tour", price: 8.0, duration: "2 hours", category: "CULTURE" },
          { name: "Yoga Intensive", price: 20.0, duration: "Half day", category: "RELAXATION" },
          { name: "Palace Illumination Viewing", price: 0.0, duration: "Evening", category: "NATURE" }
        ]
      }
    },
    {
      name: "Ahmedabad",
      country: "India",
      description: "A vibrant city known for its cotton and textiles",
      population: "5.6M",
      averageDailyCost: 30.0,
      bestSeason: "November-February",
      language: "Gujarati",
      currency: "INR",
      vibe: "vibrant",
      imageUrl: "https://example.com/ahmedabad.jpg",
      latitude: 23.0225,
      longitude: 72.5714,
      attractions: {
        create: [
          { name: "Sabarmati Ashram", description: "Gandhi's former residence", imageUrl: "https://example.com/sabarmati.jpg" },
          { name: "Adalaj Stepwell", description: "Intricate 5-story stepwell", imageUrl: "https://example.com/adalaj.jpg" },
          { name: "Kankaria Lake", description: "Circular lake with entertainment", imageUrl: "https://example.com/kankaria.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Heritage Night Walk", price: 10.0, duration: "2 hours", category: "CULTURE" },
          { name: "Textile Museum Tour", price: 5.0, duration: "1.5 hours", category: "CULTURE" },
          { name: "Gujarati Thali Dinner", price: 12.0, duration: "Evening", category: "FOOD" }
        ]
      }
    },
    {
      name: "Shimla",
      country: "India",
      description: "A popular colonial-era hill station",
      population: "170K",
      averageDailyCost: 40.0,
      bestSeason: "March-June",
      language: "Hindi",
      currency: "INR",
      vibe: "scenic",
      imageUrl: "https://example.com/shimla.jpg",
      latitude: 31.1048,
      longitude: 77.1734,
      attractions: {
        create: [
          { name: "The Ridge", description: "Large open space in the heart of town", imageUrl: "https://example.com/ridge.jpg" },
          { name: "Jakhoo Temple", description: "Ancient temple dedicated to Hanuman", imageUrl: "https://example.com/jakhoo.jpg" },
          { name: "Mall Road", description: "Main shopping street", imageUrl: "https://example.com/mallroad.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Kalka-Shimla Toy Train", price: 10.0, duration: "4 hours", category: "NATURE" },
          { name: "Ice Skating", price: 8.0, duration: "1 hour", category: "ADVENTURE" },
          { name: "Hike to Chadwick Falls", price: 0.0, duration: "Half day", category: "NATURE" }
        ]
      }
    },
    {
      name: "Pondicherry",
      country: "India",
      description: "A charming town with French colonial architecture",
      population: "244K",
      averageDailyCost: 35.0,
      bestSeason: "October-March",
      language: "Tamil, French",
      currency: "INR",
      vibe: "relaxed",
      imageUrl: "https://example.com/pondicherry.jpg",
      latitude: 11.9416,
      longitude: 79.8083,
      attractions: {
        create: [
          { name: "Auroville", description: "Experimental township", imageUrl: "https://example.com/auroville.jpg" },
          { name: "Promenade Beach", description: "Rocky beachfront", imageUrl: "https://example.com/promenade.jpg" },
          { name: "Sri Aurobindo Ashram", description: "Spiritual community", imageUrl: "https://example.com/ashram.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "French Quarter Cycling", price: 12.0, duration: "2 hours", category: "ADVENTURE" },
          { name: "Surfing Lessons", price: 25.0, duration: "2 hours", category: "ADVENTURE" },
          { name: "Cafe Hopping", price: 15.0, duration: "Afternoon", category: "FOOD" }
        ]
      }
    },
    {
      name: "Hampi",
      country: "India",
      description: "An ancient village full of stunning ruins",
      population: "3K",
      averageDailyCost: 20.0,
      bestSeason: "October-February",
      language: "Kannada",
      currency: "INR",
      vibe: "historic",
      imageUrl: "https://example.com/hampi.jpg",
      latitude: 15.335,
      longitude: 76.46,
      attractions: {
        create: [
          { name: "Virupaksha Temple", description: "Historic Hindu temple", imageUrl: "https://example.com/virupaksha.jpg" },
          { name: "Vittala Temple", description: "Iconic stone chariot", imageUrl: "https://example.com/vittala.jpg" },
          { name: "Matanga Hill", description: "Sunrise viewpoint", imageUrl: "https://example.com/matanga.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Bouldering", price: 15.0, duration: "Half day", category: "ADVENTURE" },
          { name: "Coracle Ride", price: 5.0, duration: "1 hour", category: "NATURE" },
          { name: "Guided Ruins Tour", price: 20.0, duration: "Half day", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Manali",
      country: "India",
      description: "A high-altitude resort town for adventure seekers",
      population: "8K",
      averageDailyCost: 35.0,
      bestSeason: "October-June",
      language: "Hindi",
      currency: "INR",
      vibe: "adventurous",
      imageUrl: "https://example.com/manali.jpg",
      latitude: 32.2396,
      longitude: 77.1887,
      attractions: {
        create: [
          { name: "Rohtang Pass", description: "High mountain pass", imageUrl: "https://example.com/rohtang.jpg" },
          { name: "Solang Valley", description: "Hub for adventure sports", imageUrl: "https://example.com/solang.jpg" },
          { name: "Hadimba Temple", description: "Wooden cave temple", imageUrl: "https://example.com/hadimba.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Paragliding", price: 40.0, duration: "1 hour", category: "ADVENTURE" },
          { name: "Skiing", price: 30.0, duration: "Half day", category: "ADVENTURE" },
          { name: "Trekking to Bhrigu Lake", price: 50.0, duration: "Full day", category: "ADVENTURE" }
        ]
      }
    },
    {
      name: "Jaisalmer",
      country: "India",
      description: "The Golden City surrounded by sand dunes",
      population: "65K",
      averageDailyCost: 30.0,
      bestSeason: "November-March",
      language: "Hindi, Rajasthani",
      currency: "INR",
      vibe: "adventurous",
      imageUrl: "https://example.com/jaisalmer.jpg",
      latitude: 26.9157,
      longitude: 70.9083,
      attractions: {
        create: [
          { name: "Jaisalmer Fort", description: "Living fort made of yellow sandstone", imageUrl: "https://example.com/jaisalmerfort.jpg" },
          { name: "Sam Sand Dunes", description: "Expansive desert dunes", imageUrl: "https://example.com/dunes.jpg" },
          { name: "Patwon Ki Haveli", description: "Intricately carved mansions", imageUrl: "https://example.com/haveli.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Camel Safari", price: 20.0, duration: "Half day", category: "ADVENTURE" },
          { name: "Desert Camping", price: 60.0, duration: "Overnight", category: "NATURE" },
          { name: "Dune Bashing", price: 40.0, duration: "2 hours", category: "ADVENTURE" }
        ]
      }
    },

    // --- 25 European Cities ---
    {
      name: "Paris",
      country: "France",
      description: "Romantic capital city known for its cafe culture",
      population: "2.1M",
      averageDailyCost: 150.0,
      bestSeason: "April-May",
      language: "French",
      currency: "EUR",
      vibe: "romantic",
      imageUrl: "https://example.com/paris.jpg",
      latitude: 48.8566,
      longitude: 2.3522,
      attractions: {
        create: [
          { name: "Eiffel Tower", description: "Iconic iron lattice tower", imageUrl: "https://example.com/eiffel.jpg" },
          { name: "Louvre Museum", description: "World's largest art museum", imageUrl: "https://example.com/louvre.jpg" },
          { name: "Notre-Dame", description: "Medieval Catholic cathedral", imageUrl: "https://example.com/notredame.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Seine River Cruise", price: 20.0, duration: "1 hour", category: "NATURE" },
          { name: "Macaron Baking Class", price: 80.0, duration: "2.5 hours", category: "FOOD" },
          { name: "Montmartre Walking Tour", price: 25.0, duration: "2 hours", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Rome",
      country: "Italy",
      description: "An open-air museum of ancient history",
      population: "2.8M",
      averageDailyCost: 130.0,
      bestSeason: "April-June",
      language: "Italian",
      currency: "EUR",
      vibe: "historic",
      imageUrl: "https://example.com/rome.jpg",
      latitude: 41.9028,
      longitude: 12.4964,
      attractions: {
        create: [
          { name: "Colosseum", description: "Ancient gladiatorial arena", imageUrl: "https://example.com/colosseum.jpg" },
          { name: "Vatican Museums", description: "Home to the Sistine Chapel", imageUrl: "https://example.com/vatican.jpg" },
          { name: "Trevi Fountain", description: "Baroque masterpiece", imageUrl: "https://example.com/trevi.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Pasta Making Workshop", price: 65.0, duration: "3 hours", category: "FOOD" },
          { name: "Vespa City Tour", price: 90.0, duration: "Half day", category: "ADVENTURE" },
          { name: "Catacombs Exploration", price: 30.0, duration: "2 hours", category: "CULTURE" }
        ]
      }
    },
    {
      name: "London",
      country: "UK",
      description: "A diverse metropolis full of landmarks",
      population: "8.9M",
      averageDailyCost: 160.0,
      bestSeason: "May-September",
      language: "English",
      currency: "GBP",
      vibe: "busy",
      imageUrl: "https://example.com/london.jpg",
      latitude: 51.5074,
      longitude: -0.1278,
      attractions: {
        create: [
          { name: "Tower of London", description: "Historic castle", imageUrl: "https://example.com/tower.jpg" },
          { name: "British Museum", description: "Vast collection of world art", imageUrl: "https://example.com/british.jpg" },
          { name: "London Eye", description: "Giant observation wheel", imageUrl: "https://example.com/londoneye.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Afternoon Tea Bus Tour", price: 55.0, duration: "2 hours", category: "FOOD" },
          { name: "West End Theatre Show", price: 80.0, duration: "Evening", category: "NIGHTLIFE" },
          { name: "Thames Speedboat Ride", price: 45.0, duration: "1 hour", category: "ADVENTURE" }
        ]
      }
    },
    {
      name: "Barcelona",
      country: "Spain",
      description: "Vibrant city with stunning Gaudi architecture",
      population: "1.6M",
      averageDailyCost: 120.0,
      bestSeason: "May-June",
      language: "Spanish, Catalan",
      currency: "EUR",
      vibe: "vibrant",
      imageUrl: "https://example.com/barcelona.jpg",
      latitude: 41.3851,
      longitude: 2.1734,
      attractions: {
        create: [
          { name: "Sagrada Familia", description: "Unfinished Gaudi basilica", imageUrl: "https://example.com/sagrada.jpg" },
          { name: "Park Güell", description: "Colorful mosaic park", imageUrl: "https://example.com/parkguell.jpg" },
          { name: "Gothic Quarter", description: "Historic medieval streets", imageUrl: "https://example.com/gothic.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Tapas and Wine Tour", price: 70.0, duration: "3 hours", category: "FOOD" },
          { name: "Flamenco Show", price: 40.0, duration: "Evening", category: "NIGHTLIFE" },
          { name: "Catamaran Cruise", price: 45.0, duration: "2 hours", category: "ADVENTURE" }
        ]
      }
    },
    {
      name: "Amsterdam",
      country: "Netherlands",
      description: "Famous for its canals, cycling, and art",
      population: "872K",
      averageDailyCost: 140.0,
      bestSeason: "April-May",
      language: "Dutch",
      currency: "EUR",
      vibe: "relaxed",
      imageUrl: "https://example.com/amsterdam.jpg",
      latitude: 52.3676,
      longitude: 4.9041,
      attractions: {
        create: [
          { name: "Rijksmuseum", description: "Dutch national museum", imageUrl: "https://example.com/rijks.jpg" },
          { name: "Anne Frank House", description: "Biographical museum", imageUrl: "https://example.com/annefrank.jpg" },
          { name: "Vondelpark", description: "Large urban park", imageUrl: "https://example.com/vondelpark.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Canal Boat Tour", price: 20.0, duration: "1.5 hours", category: "ADVENTURE" },
          { name: "Guided Bike Tour", price: 30.0, duration: "3 hours", category: "ADVENTURE" },
          { name: "Heineken Experience", price: 25.0, duration: "2 hours", category: "FOOD" }
        ]
      }
    },
    {
      name: "Berlin",
      country: "Germany",
      description: "A city known for its history, art, and nightlife",
      population: "3.7M",
      averageDailyCost: 110.0,
      bestSeason: "May-September",
      language: "German",
      currency: "EUR",
      vibe: "modern",
      imageUrl: "https://example.com/berlin.jpg",
      latitude: 52.52,
      longitude: 13.405,
      attractions: {
        create: [
          { name: "Brandenburg Gate", description: "18th-century neoclassical monument", imageUrl: "https://example.com/brandenburg.jpg" },
          { name: "Berlin Wall Memorial", description: "Historic border remnant", imageUrl: "https://example.com/berlinwall.jpg" },
          { name: "Museum Island", description: "Complex of five museums", imageUrl: "https://example.com/museumisland.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Alternative Street Art Tour", price: 20.0, duration: "2.5 hours", category: "CULTURE" },
          { name: "TV Tower Fast View", price: 25.0, duration: "1 hour", category: "NATURE" },
          { name: "Underground Bunker Tour", price: 18.0, duration: "2 hours", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Prague",
      country: "Czechia",
      description: "The City of a Hundred Spires",
      population: "1.3M",
      averageDailyCost: 90.0,
      bestSeason: "May-September",
      language: "Czech",
      currency: "CZK",
      vibe: "historic",
      imageUrl: "https://example.com/prague.jpg",
      latitude: 50.0755,
      longitude: 14.4378,
      attractions: {
        create: [
          { name: "Charles Bridge", description: "Historic stone bridge", imageUrl: "https://example.com/charlesbridge.jpg" },
          { name: "Prague Castle", description: "Vast castle complex", imageUrl: "https://example.com/praguecastle.jpg" },
          { name: "Old Town Square", description: "Historic square with astronomical clock", imageUrl: "https://example.com/oldtown.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Vltava River Cruise", price: 15.0, duration: "1 hour", category: "ADVENTURE" },
          { name: "Czech Beer Tasting", price: 25.0, duration: "2 hours", category: "FOOD" },
          { name: "Ghost and Legends Walk", price: 18.0, duration: "Evening", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Vienna",
      country: "Austria",
      description: "The city of music and grand palaces",
      population: "1.8M",
      averageDailyCost: 130.0,
      bestSeason: "April-May",
      language: "German",
      currency: "EUR",
      vibe: "cultural",
      imageUrl: "https://example.com/vienna.jpg",
      latitude: 48.2082,
      longitude: 16.3738,
      attractions: {
        create: [
          { name: "Schönbrunn Palace", description: "Baroque summer residence", imageUrl: "https://example.com/schonbrunn.jpg" },
          { name: "Hofburg", description: "Imperial palace complex", imageUrl: "https://example.com/hofburg.jpg" },
          { name: "St. Stephen's Cathedral", description: "Gothic cathedral", imageUrl: "https://example.com/stephens.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Classical Concert", price: 50.0, duration: "Evening", category: "NIGHTLIFE" },
          { name: "Viennese Waltz Lesson", price: 35.0, duration: "1.5 hours", category: "CULTURE" },
          { name: "Strudel Baking Show", price: 20.0, duration: "1 hour", category: "FOOD" }
        ]
      }
    },
    {
      name: "Budapest",
      country: "Hungary",
      description: "Famous for its thermal baths and Danube river views",
      population: "1.7M",
      averageDailyCost: 80.0,
      bestSeason: "March-May",
      language: "Hungarian",
      currency: "HUF",
      vibe: "historic",
      imageUrl: "https://example.com/budapest.jpg",
      latitude: 47.4979,
      longitude: 19.0402,
      attractions: {
        create: [
          { name: "Hungarian Parliament", description: "Gothic Revival building", imageUrl: "https://example.com/parliament.jpg" },
          { name: "Széchenyi Thermal Bath", description: "Largest medicinal bath in Europe", imageUrl: "https://example.com/baths.jpg" },
          { name: "Fisherman's Bastion", description: "Fairy-tale viewing terrace", imageUrl: "https://example.com/bastion.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Danube Night Cruise", price: 20.0, duration: "1.5 hours", category: "ADVENTURE" },
          { name: "Ruin Bar Crawl", price: 15.0, duration: "Evening", category: "NIGHTLIFE" },
          { name: "Thermal Bath Relaxation", price: 25.0, duration: "Half day", category: "RELAXATION" }
        ]
      }
    },
    {
      name: "Athens",
      country: "Greece",
      description: "The birthplace of democracy and ancient ruins",
      population: "664K",
      averageDailyCost: 100.0,
      bestSeason: "March-May",
      language: "Greek",
      currency: "EUR",
      vibe: "historic",
      imageUrl: "https://example.com/athens.jpg",
      latitude: 37.9838,
      longitude: 23.7275,
      attractions: {
        create: [
          { name: "Acropolis of Athens", description: "Ancient hilltop citadel", imageUrl: "https://example.com/acropolis.jpg" },
          { name: "Parthenon", description: "Temple dedicated to Athena", imageUrl: "https://example.com/parthenon.jpg" },
          { name: "Plaka", description: "Historic neighborhood", imageUrl: "https://example.com/plaka.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Greek Cooking Class", price: 60.0, duration: "3 hours", category: "FOOD" },
          { name: "Mythology Walking Tour", price: 35.0, duration: "2 hours", category: "CULTURE" },
          { name: "Cape Sounion Sunset Trip", price: 50.0, duration: "Half day", category: "NATURE" }
        ]
      }
    },
    {
      name: "Madrid",
      country: "Spain",
      description: "A lively city with rich art museums and food",
      population: "3.2M",
      averageDailyCost: 110.0,
      bestSeason: "September-November",
      language: "Spanish",
      currency: "EUR",
      vibe: "vibrant",
      imageUrl: "https://example.com/madrid.jpg",
      latitude: 40.4168,
      longitude: -3.7038,
      attractions: {
        create: [
          { name: "Prado Museum", description: "World-class European art", imageUrl: "https://example.com/prado.jpg" },
          { name: "Royal Palace of Madrid", description: "Official residence of the royal family", imageUrl: "https://example.com/royalpalace.jpg" },
          { name: "Retiro Park", description: "Vast 19th-century park", imageUrl: "https://example.com/retiro.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Churros and Chocolate Tasting", price: 10.0, duration: "1 hour", category: "FOOD" },
          { name: "Bernabeu Stadium Tour", price: 25.0, duration: "2 hours", category: "ADVENTURE" },
          { name: "Tapas Crawl in La Latina", price: 45.0, duration: "Evening", category: "FOOD" }
        ]
      }
    },
    {
      name: "Lisbon",
      country: "Portugal",
      description: "A sunny, hilly city known for its pastel buildings",
      population: "504K",
      averageDailyCost: 100.0,
      bestSeason: "March-May",
      language: "Portuguese",
      currency: "EUR",
      vibe: "relaxed",
      imageUrl: "https://example.com/lisbon.jpg",
      latitude: 38.7223,
      longitude: -9.1393,
      attractions: {
        create: [
          { name: "Belém Tower", description: "16th-century fortification", imageUrl: "https://example.com/belem.jpg" },
          { name: "Jerónimos Monastery", description: "Manueline architecture", imageUrl: "https://example.com/jeronimos.jpg" },
          { name: "Alfama", description: "Oldest district of Lisbon", imageUrl: "https://example.com/alfama.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Pastel de Nata Class", price: 35.0, duration: "2 hours", category: "FOOD" },
          { name: "Tram 28 Ride", price: 3.0, duration: "1 hour", category: "NATURE" },
          { name: "Fado Music Show with Dinner", price: 50.0, duration: "Evening", category: "NIGHTLIFE" }
        ]
      }
    },
    {
      name: "Venice",
      country: "Italy",
      description: "The magical city built on water",
      population: "261K",
      averageDailyCost: 150.0,
      bestSeason: "September-November",
      language: "Italian",
      currency: "EUR",
      vibe: "romantic",
      imageUrl: "https://example.com/venice.jpg",
      latitude: 45.4408,
      longitude: 12.3155,
      attractions: {
        create: [
          { name: "St. Mark's Basilica", description: "Italo-Byzantine architecture", imageUrl: "https://example.com/stmarks.jpg" },
          { name: "Grand Canal", description: "Main water traffic corridor", imageUrl: "https://example.com/grandcanal.jpg" },
          { name: "Rialto Bridge", description: "Oldest bridge across the canal", imageUrl: "https://example.com/rialto.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Gondola Ride", price: 80.0, duration: "45 mins", category: "NATURE" },
          { name: "Murano Glass Blowing Tour", price: 20.0, duration: "Half day", category: "CULTURE" },
          { name: "Mask Making Workshop", price: 45.0, duration: "2 hours", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Florence",
      country: "Italy",
      description: "The birthplace of the Renaissance",
      population: "382K",
      averageDailyCost: 140.0,
      bestSeason: "May-September",
      language: "Italian",
      currency: "EUR",
      vibe: "cultural",
      imageUrl: "https://example.com/florence.jpg",
      latitude: 43.7696,
      longitude: 11.2558,
      attractions: {
        create: [
          { name: "Uffizi Gallery", description: "Prominent art museum", imageUrl: "https://example.com/uffizi.jpg" },
          { name: "Florence Cathedral", description: "Il Duomo di Firenze", imageUrl: "https://example.com/duomo.jpg" },
          { name: "Ponte Vecchio", description: "Medieval stone closed-spandrel bridge", imageUrl: "https://example.com/pontevecchio.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Chianti Wine Tasting", price: 60.0, duration: "Half day", category: "FOOD" },
          { name: "Michelangelo's David Tour", price: 30.0, duration: "2 hours", category: "CULTURE" },
          { name: "Leather Crafting Workshop", price: 40.0, duration: "2 hours", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Munich",
      country: "Germany",
      description: "Known for Oktoberfest and Bavarian culture",
      population: "1.4M",
      averageDailyCost: 130.0,
      bestSeason: "September-October",
      language: "German",
      currency: "EUR",
      vibe: "traditional",
      imageUrl: "https://example.com/munich.jpg",
      latitude: 48.1351,
      longitude: 11.582,
      attractions: {
        create: [
          { name: "Marienplatz", description: "Central square in the city centre", imageUrl: "https://example.com/marienplatz.jpg" },
          { name: "Nymphenburg Palace", description: "Baroque palace", imageUrl: "https://example.com/nymphenburg.jpg" },
          { name: "English Garden", description: "Large public park", imageUrl: "https://example.com/englishgarden.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Bavarian Beer Tour", price: 35.0, duration: "3 hours", category: "FOOD" },
          { name: "BMW Museum Visit", price: 15.0, duration: "2 hours", category: "CULTURE" },
          { name: "Neuschwanstein Castle Day Trip", price: 70.0, duration: "Full day", category: "NATURE" }
        ]
      }
    },
    {
      name: "Dublin",
      country: "Ireland",
      description: "A friendly city with a rich literary history and pubs",
      population: "544K",
      averageDailyCost: 140.0,
      bestSeason: "June-August",
      language: "English, Irish",
      currency: "EUR",
      vibe: "bustling",
      imageUrl: "https://example.com/dublin.jpg",
      latitude: 53.3498,
      longitude: -6.2603,
      attractions: {
        create: [
          { name: "Guinness Storehouse", description: "Brewery experience", imageUrl: "https://example.com/guinness.jpg" },
          { name: "Trinity College Library", description: "Home of the Book of Kells", imageUrl: "https://example.com/trinity.jpg" },
          { name: "Temple Bar", description: "Busy riverside neighborhood", imageUrl: "https://example.com/templebar.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Irish Whiskey Museum Tour", price: 20.0, duration: "1.5 hours", category: "FOOD" },
          { name: "Cliffs of Moher Day Trip", price: 65.0, duration: "Full day", category: "NATURE" },
          { name: "Traditional Pub Crawl", price: 30.0, duration: "Evening", category: "NIGHTLIFE" }
        ]
      }
    },
    {
      name: "Edinburgh",
      country: "UK",
      description: "A hilly, historic capital known for its castle",
      population: "488K",
      averageDailyCost: 130.0,
      bestSeason: "May-August",
      language: "English",
      currency: "GBP",
      vibe: "historic",
      imageUrl: "https://example.com/edinburgh.jpg",
      latitude: 55.9533,
      longitude: -3.1883,
      attractions: {
        create: [
          { name: "Edinburgh Castle", description: "Historic fortress", imageUrl: "https://example.com/edinburghcastle.jpg" },
          { name: "Royal Mile", description: "Succession of streets forming the main thoroughfare", imageUrl: "https://example.com/royalmile.jpg" },
          { name: "Arthur's Seat", description: "Ancient volcano and peak", imageUrl: "https://example.com/arthursseat.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Underground Vaults Tour", price: 20.0, duration: "1.5 hours", category: "CULTURE" },
          { name: "Scotch Whisky Experience", price: 25.0, duration: "2 hours", category: "FOOD" },
          { name: "Loch Ness Day Trip", price: 60.0, duration: "Full day", category: "NATURE" }
        ]
      }
    },
    {
      name: "Stockholm",
      country: "Sweden",
      description: "A picturesque city spread across 14 islands",
      population: "975K",
      averageDailyCost: 160.0,
      bestSeason: "June-August",
      language: "Swedish",
      currency: "SEK",
      vibe: "scenic",
      imageUrl: "https://example.com/stockholm.jpg",
      latitude: 59.3293,
      longitude: 18.0686,
      attractions: {
        create: [
          { name: "Vasa Museum", description: "Maritime museum", imageUrl: "https://example.com/vasa.jpg" },
          { name: "Gamla Stan", description: "Old Town", imageUrl: "https://example.com/gamla.jpg" },
          { name: "ABBA The Museum", description: "Interactive exhibition", imageUrl: "https://example.com/abba.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Archipelago Boat Tour", price: 35.0, duration: "3 hours", category: "NATURE" },
          { name: "Nordic Food Walk", price: 80.0, duration: "3 hours", category: "FOOD" },
          { name: "Icebar Experience", price: 25.0, duration: "45 mins", category: "NIGHTLIFE" }
        ]
      }
    },
    {
      name: "Copenhagen",
      country: "Denmark",
      description: "A bicycle-friendly city with colorful harbors",
      population: "602K",
      averageDailyCost: 160.0,
      bestSeason: "May-August",
      language: "Danish",
      currency: "DKK",
      vibe: "relaxed",
      imageUrl: "https://example.com/copenhagen.jpg",
      latitude: 55.6761,
      longitude: 12.5683,
      attractions: {
        create: [
          { name: "Tivoli Gardens", description: "Amusement park and pleasure garden", imageUrl: "https://example.com/tivoli.jpg" },
          { name: "Nyhavn", description: "17th-century waterfront", imageUrl: "https://example.com/nyhavn.jpg" },
          { name: "The Little Mermaid", description: "Bronze statue", imageUrl: "https://example.com/mermaid.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Canal Tour", price: 15.0, duration: "1 hour", category: "NATURE" },
          { name: "City Bike Rental", price: 10.0, duration: "Full day", category: "ADVENTURE" },
          { name: "Danish Pastry Baking Class", price: 50.0, duration: "2 hours", category: "FOOD" }
        ]
      }
    },
    {
      name: "Oslo",
      country: "Norway",
      description: "Surrounded by mountains and the sea",
      population: "634K",
      averageDailyCost: 170.0,
      bestSeason: "June-August",
      language: "Norwegian",
      currency: "NOK",
      vibe: "scenic",
      imageUrl: "https://example.com/oslo.jpg",
      latitude: 59.9139,
      longitude: 10.7522,
      attractions: {
        create: [
          { name: "Vigeland Sculpture Park", description: "World's largest sculpture park", imageUrl: "https://example.com/vigeland.jpg" },
          { name: "Fram Museum", description: "Museum of polar exploration", imageUrl: "https://example.com/fram.jpg" },
          { name: "Oslo Opera House", description: "Contemporary architecture", imageUrl: "https://example.com/opera.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Fjord Sightseeing Cruise", price: 40.0, duration: "2 hours", category: "NATURE" },
          { name: "Holmenkollen Ski Jump Zip Line", price: 65.0, duration: "1 hour", category: "ADVENTURE" },
          { name: "Sauna and Fjord Dip", price: 25.0, duration: "2 hours", category: "RELAXATION" }
        ]
      }
    },
    {
      name: "Helsinki",
      country: "Finland",
      description: "A design-forward capital by the Baltic Sea",
      population: "654K",
      averageDailyCost: 150.0,
      bestSeason: "June-August",
      language: "Finnish",
      currency: "EUR",
      vibe: "modern",
      imageUrl: "https://example.com/helsinki.jpg",
      latitude: 60.1695,
      longitude: 24.9354,
      attractions: {
        create: [
          { name: "Suomenlinna", description: "Sea fortress", imageUrl: "https://example.com/suomenlinna.jpg" },
          { name: "Helsinki Cathedral", description: "Evangelical Lutheran cathedral", imageUrl: "https://example.com/helsinkicathedral.jpg" },
          { name: "Temppeliaukio Church", description: "Rock church", imageUrl: "https://example.com/rockchurch.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Traditional Finnish Sauna", price: 20.0, duration: "2 hours", category: "RELAXATION" },
          { name: "Archipelago Boat Tour", price: 30.0, duration: "1.5 hours", category: "NATURE" },
          { name: "Design District Walking Tour", price: 15.0, duration: "2 hours", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Warsaw",
      country: "Poland",
      description: "A resilient city with a beautifully restored Old Town",
      population: "1.7M",
      averageDailyCost: 80.0,
      bestSeason: "May-September",
      language: "Polish",
      currency: "PLN",
      vibe: "historic",
      imageUrl: "https://example.com/warsaw.jpg",
      latitude: 52.2297,
      longitude: 21.0122,
      attractions: {
        create: [
          { name: "Warsaw Old Town", description: "Reconstructed historic center", imageUrl: "https://example.com/warsawold.jpg" },
          { name: "Royal Castle", description: "State rooms and art", imageUrl: "https://example.com/royalcastle.jpg" },
          { name: "Łazienki Park", description: "Largest park in Warsaw", imageUrl: "https://example.com/lazienki.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Pierogi Cooking Class", price: 35.0, duration: "2.5 hours", category: "FOOD" },
          { name: "Chopin Piano Concert", price: 20.0, duration: "Evening", category: "NIGHTLIFE" },
          { name: "Communism Tour in Retro Bus", price: 40.0, duration: "3 hours", category: "CULTURE" }
        ]
      }
    },
    {
      name: "Krakow",
      country: "Poland",
      description: "Known for its well-preserved medieval core",
      population: "779K",
      averageDailyCost: 75.0,
      bestSeason: "May-October",
      language: "Polish",
      currency: "PLN",
      vibe: "historic",
      imageUrl: "https://example.com/krakow.jpg",
      latitude: 50.0647,
      longitude: 19.945,
      attractions: {
        create: [
          { name: "Wawel Royal Castle", description: "Gothic castle complex", imageUrl: "https://example.com/wawel.jpg" },
          { name: "Main Square", description: "Largest medieval town square in Europe", imageUrl: "https://example.com/mainsquare.jpg" },
          { name: "Auschwitz-Birkenau", description: "Memorial and museum", imageUrl: "https://example.com/auschwitz.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Wieliczka Salt Mine Tour", price: 30.0, duration: "Half day", category: "CULTURE" },
          { name: "Jewish Quarter Walking Tour", price: 15.0, duration: "2 hours", category: "CULTURE" },
          { name: "Vodka Tasting", price: 25.0, duration: "1.5 hours", category: "FOOD" }
        ]
      }
    },
    {
      name: "Zurich",
      country: "Switzerland",
      description: "A global center for banking surrounded by natural beauty",
      population: "415K",
      averageDailyCost: 180.0,
      bestSeason: "June-August",
      language: "German",
      currency: "CHF",
      vibe: "modern",
      imageUrl: "https://example.com/zurich.jpg",
      latitude: 47.3769,
      longitude: 8.5417,
      attractions: {
        create: [
          { name: "Lake Zurich", description: "Beautiful lake for boating", imageUrl: "https://example.com/lakezurich.jpg" },
          { name: "Grossmünster", description: "Romanesque-style Protestant church", imageUrl: "https://example.com/grossmunster.jpg" },
          { name: "Bahnhofstrasse", description: "Exclusive shopping avenue", imageUrl: "https://example.com/bahnhof.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Swiss Chocolate Tour", price: 50.0, duration: "2 hours", category: "FOOD" },
          { name: "Mount Titlis Day Trip", price: 150.0, duration: "Full day", category: "NATURE" },
          { name: "Rhine Falls Excursion", price: 60.0, duration: "Half day", category: "NATURE" }
        ]
      }
    },
    {
      name: "Reykjavik",
      country: "Iceland",
      description: "The northernmost capital, famous for natural wonders",
      population: "131K",
      averageDailyCost: 190.0,
      bestSeason: "June-August",
      language: "Icelandic",
      currency: "ISK",
      vibe: "adventurous",
      imageUrl: "https://example.com/reykjavik.jpg",
      latitude: 64.1466,
      longitude: -21.9426,
      attractions: {
        create: [
          { name: "Hallgrimskirkja", description: "Iconic church tower", imageUrl: "https://example.com/hallgrimskirkja.jpg" },
          { name: "Blue Lagoon", description: "Geothermal spa", imageUrl: "https://example.com/bluelagoon.jpg" },
          { name: "Harpa", description: "Concert hall and conference centre", imageUrl: "https://example.com/harpa.jpg" }
        ]
      },
      activities: {
        create: [
          { name: "Golden Circle Tour", price: 80.0, duration: "Full day", category: "NATURE" },
          { name: "Northern Lights Hunt", price: 60.0, duration: "Evening", category: "NATURE" },
          { name: "Whale Watching", price: 90.0, duration: "3 hours", category: "NATURE" }
        ]
      }
    }
  ];

  // 1. Automate the image URLs dynamically
  const citiesWithAutomatedImages = cities.map((city) => {
    return {
      ...city,
      // Generate an image URL based on the city name
      imageUrl: `https://loremflickr.com/800/600/${encodeURIComponent(city.name)},city/all`,
      
      attractions: {
        create: city.attractions.create.map((attraction) => ({
          ...attraction,
          // Generate an image URL based on the attraction name
          imageUrl: `https://loremflickr.com/800/600/${encodeURIComponent(attraction.name)}/all`,
        })),
      },
      // Activities don't have images in your current schema, but if they did, 
      // you could map over them exactly like the attractions above.
    };
  });

  // 2. Update your loop to use the new array
  for (const city of citiesWithAutomatedImages) {
    await prisma.city.create({
      data: city,
    });
  }

  console.log("50 cities with full nested attractions, categorized activities, and coordinates added successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });