const EVStation = require("../models/evStation.model");
const ExpressError = require("../utils/ExpressError");

module.exports.getNearbyStations = async (req, res) => {
  const { lat, lng, radius = 5000, page = 1 } = req.query;

  if (!lat || !lng) {
    throw new ExpressError(400, "Latitude and longitude are required");
  }

  const limit = 200;
  const skip = (page - 1) * limit;

  const stations = await EVStation.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseInt(radius),
      },
    },
  })
    .skip(skip)
    .limit(limit);

  const totalStations = await EVStation.countDocuments();

  res.status(200).json({
    success: true,
    page: Number(page),
    results: stations.length,
    total: totalStations,
    stations,
  });
};

module.exports.getStationById = async (req, res) => {
  const station = await EVStation.findById(req.params.id);

  res.status(200).json({
    success: true,
    station,
  });
};

module.exports.getAllStationsForMap = async (req, res) => {
  const stations = await EVStation.find({});

  res.status(200).json({
    success: true,
    stations,
  });
};
