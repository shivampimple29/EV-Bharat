const EVStation = require("../models/evStation.model");
const ExpressError = require("../utils/ExpressError");

// ── GET NEARBY STATIONS ──
module.exports.getNearbyStations = async (req, res) => {
  const { lat, lng, radius = 5000, page = 1 } = req.query;

  if (!lat || !lng) {
    throw new ExpressError(400, "Latitude and longitude are required");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const geoFilter = {
    // ✅ removed status: "approved" — data not seeded with status yet
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseInt(radius),
      },
    },
  };

  const stations = await EVStation.find(geoFilter)
    .select("-updatedBy -__v")
    .skip(skip)
    .limit(limit);

  const total = stations.length;

  res.status(200).json({ success: true, page: Number(page), results: stations.length, total, stations });
};

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

  // If GPS coords provided → return only nearby stations within radius
  const filter = lat && lng
    ? {
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: parseInt(radius),
          },
        },
      }
    : {}; // No GPS → return all (fallback)

  const stations = await EVStation.find(filter)
    .select("name location address averageRating isVerified chargers operator")
    // .limit(200); // cap at 200 even in fallback

  res.status(200).json({ success: true, total: stations.length, stations });
};

// ── GET ALL STATIONS WITH SEARCH + PAGINATION ──
module.exports.getAllStations = async (req, res) => {
  const { page = 1, search = "", city = "", chargerType = "" } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;
  const filter = {}; // ✅ already correct — no status filter

  if (search.trim()) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { operator: { $regex: search, $options: "i" } },
      { "address.city": { $regex: search, $options: "i" } },
      { "address.state": { $regex: search, $options: "i" } },
    ];
  }

  if (city.trim())        filter["address.city"]    = { $regex: city, $options: "i" };
  if (chargerType.trim()) filter["chargers.type"]   = { $regex: chargerType, $options: "i" };

  const [stations, total] = await Promise.all([
    EVStation.find(filter)
      .select("name operator address location averageRating isVerified chargers status image")
      .skip(skip)
      .limit(limit)
      .sort({ averageRating: -1 }),
    EVStation.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, page: Number(page), totalPages: Math.ceil(total / limit), results: stations.length, total, stations });
};


// ── CREATE STATION ──
module.exports.createStation = async (req, res) => {
  const {
    name, description, operator,
    city, state, country,
    lat, lng,
    chargers,   // array
    amenities,  // array
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
    chargers:   chargers   || [],
    amenities:  amenities  || [],
    status:     "pending",       // ← always pending until admin approves
    createdBy:  req.user.id,     // ← from JWT via protect middleware
  });

  res.status(201).json({
    success: true,
    message: "Station submitted for review.",
    station,
  });
};
