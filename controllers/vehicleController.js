const Vehicle = require('../models/vehicle');

// GET /vehicles - fetch all vehicles
exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    next(error);
  }
};

// GET /vehicles/available - fetch only available vehicles
exports.getAvailableVehicles = async (req, res, next) => {
  try {
    const availableVehicles = await Vehicle.find({ available: true });
    res.status(200).json(availableVehicles);
  } catch (error) {
    next(error); 
  }
};

// GET /vehicles/featured - fetch featured vehicles
exports.getFeaturedVehicles = async (req, res, next) => {
  try {
    const featuredVehicles = await Vehicle.find({ isFeatured: true });
    res.status(200).json(featuredVehicles);
  } catch (error) {
    next(error);
  }
};

// GET /vehicles/search - search vehicles with filters
exports.searchVehicles = async (req, res, next) => {
  try {
    const { 
      query, 
      type, 
      priceRange, 
      sortBy = 'featured',
      limit = 50 
    } = req.query;

    // Build search criteria
    let searchCriteria = { available: true };

    // Text search for make, model, or description
    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), 'i');
      searchCriteria.$or = [
        { make: searchRegex },
        { model: searchRegex },
        { description: searchRegex }
      ];
    }

    // Filter by vehicle type
    if (type && type.trim()) {
      searchCriteria.type = type;
    }

    // Filter by price range
    if (priceRange && priceRange.trim()) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      if (maxPrice) {
        searchCriteria.pricePerDay = { $gte: minPrice, $lte: maxPrice };
      } else {
        // Handle "151+" case
        searchCriteria.pricePerDay = { $gte: minPrice };
      }
    }

    // Build sort criteria
    let sortCriteria = {};
    switch (sortBy) {
      case 'price-low':
        sortCriteria.pricePerDay = 1;
        break;
      case 'price-high':
        sortCriteria.pricePerDay = -1;
        break;
      case 'newest':
        sortCriteria.createdAt = -1;
        break;
      case 'featured':
      default:
        sortCriteria.isFeatured = -1;
        sortCriteria.createdAt = -1;
        break;
    }

    const vehicles = await Vehicle.find(searchCriteria)
      .sort(sortCriteria)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles: vehicles
    });
  } catch (error) {
    next(error);
  }
};
