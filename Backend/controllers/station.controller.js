const EVStation = require("../models/evStation.model");
const ExpressError = require("../utils/ExpressError");

// ── GET STATION BY ID ──
module.exports.getStationById = async (req, res) => {
  const station = await EVStation.findById(req.params.id)
    .populate("createdBy", "name email")
    .select("-__v");
  if (!station) throw new ExpressError(404, "Station not found");
  res.status(200).json({ success: true, station });
};

// ── GET ALL STATIONS FOR MAP ──
module.exports.getAllStationsForMap = async (req, res) => {
  const { lat, lng, radius = 200000 } = req.query;
  const filter = lat && lng
    ? {
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: parseInt(radius),
          },
        },
      }
    : {};
  const stations = await EVStation.find(filter)
    .select("name location address averageRating isVerified chargers operator");
  res.status(200).json({ success: true, total: stations.length, stations });
};

// ── GET NEARBY STATIONS ──
module.exports.getNearbyStations = async (req, res) => {
  const { lat, lng, radius = 200000 } = req.query;
  if (!lat || !lng) throw new ExpressError(400, "lat and lng are required");
  const stations = await EVStation.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseInt(radius),
      },
    },
  }).select("name location address averageRating isVerified chargers operator");
  res.status(200).json({ success: true, total: stations.length, stations });
};

// ── GET STATIONS ALONG ROUTE ── 
module.exports.getStationsAlongRoute = async (req, res) => {
  const { coordinates, bufferKm = 10 } = req.body;

  if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
    throw new ExpressError(400, "Route coordinates array is required");
  }

  // ── 100 points instead of 25 — handles routes up to 3000km ──────
  const MAX_POINTS = 100;
  const step = Math.max(1, Math.floor(coordinates.length / MAX_POINTS));
  const sampled = coordinates.filter((_, i) => i % step === 0);

  // Always include last point
  const last = coordinates[coordinates.length - 1];
  if (sampled[sampled.length - 1] !== last) sampled.push(last);

  const radiusRadians = parseFloat(bufferKm) / 6378.1;

  const geoConditions = sampled.map(([lng, lat]) => ({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radiusRadians],
      },
    },
  }));

  const stations = await EVStation.find({ $or: geoConditions })
    .select("name location address averageRating isVerified chargers operator")
    .lean();

  const seen = new Set();
  const unique = stations.filter(s => {
    const id = s._id.toString();
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  res.status(200).json({ success: true, total: unique.length, stations: unique });
};

// ── GET ALL STATIONS WITH SEARCH + FILTERS + OPTIONAL GPS ──
module.exports.getAllStations = async (req, res) => {
  const {
    search      = "",
    chargerType = "",
    minPower    = "",
    available   = "",
    verified    = "",
    minRating   = "",
    city        = "",
    state       = "",
    sortBy      = "rating",
    lat         = "",
    lng         = "",
    radius      = "200000",
  } = req.query;

  let filter = {};

  if (lat && lng) {
    filter.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseInt(radius),
      },
    };
  }

  if (search.trim()) {
    filter.$or = [
      { name:            { $regex: search.trim(), $options: "i" } },
      { operator:        { $regex: search.trim(), $options: "i" } },
      { "address.city":  { $regex: search.trim(), $options: "i" } },
      { "address.state": { $regex: search.trim(), $options: "i" } },
    ];
  }

  if (chargerType.trim() || minPower || available === "true") {
    const chargerMatch = {};
    if (chargerType.trim()) {
      chargerMatch.type = { $regex: `^${chargerType.trim()}$`, $options: "i" };
    }
    if (minPower && !isNaN(parseFloat(minPower))) {
      chargerMatch.power = { $gte: parseFloat(minPower) };
    }
    if (available === "true") {
      chargerMatch.availablePorts = { $gt: 0 };
    }
    filter.chargers = { $elemMatch: chargerMatch };
  }

  if (verified === "true") filter.isVerified = true;

  if (minRating && !isNaN(parseFloat(minRating))) {
    filter.averageRating = { $gte: parseFloat(minRating) };
  }

  if (city.trim()) {
    filter["address.city"] = { $regex: `^${city.trim()}$`, $options: "i" };
  }

  if (state.trim()) {
    filter["address.state"] = { $regex: `^${state.trim()}$`, $options: "i" };
  }

  const sortOption = lat && lng
    ? {}
    : sortBy === "newest"
      ? { createdAt: -1 }
      : { averageRating: -1 };

  const stations = await EVStation.find(filter)
    .select("name operator address location averageRating isVerified chargers status image")
    .sort(sortOption);

  res.status(200).json({ success: true, total: stations.length, stations });
};

// ── CREATE STATION ──
module.exports.createStation = async (req, res) => {
  const {
    name, description, operator,
    city, state, country,
    lat, lng,
    chargers,
    amenities,
  } = req.body;

  if (!name || !lat || !lng) {
    throw new ExpressError(400, "Name, latitude and longitude are required");
  }

  const station = await EVStation.create({
    name,
    description,
    operator,
    address: { city, state, country },
    location: {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    },
    chargers: chargers || [],
    amenities: amenities || [],
    status: "pending",
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Station submitted for review.",
    station,
  });
};