require("dotenv").config();
const axios    = require("axios");
const mongoose = require("mongoose");
const EVStation = require("../models/evStation.model");

const DB_URL       = process.env.ATLASDB_URL;
const DEFAULT_IMAGE = "/images/ev-station-default.jpeg";

async function importChargers() {
  try {
    await mongoose.connect(DB_URL);
    console.log("MongoDB connected");

    //  clear old data first to avoid duplicates
    await EVStation.deleteMany({});
    console.log("🗑️  Cleared old stations");

    const response = await axios.get(
      `https://api.openchargemap.io/v3/poi/?output=json&countrycode=IN&maxresults=1200&key=${process.env.OPENCHARGEMAP_API_KEY}`
    );

    const stations = response.data;

    const formattedStations = stations
      .filter((s) => s.AddressInfo && s.AddressInfo.Latitude)
      .map((s) => ({
        name:     s.AddressInfo.Title || "EV Charging Station",
        operator: s.OperatorInfo?.Title || "Unknown",
        image:    s.MediaItems?.[0]?.ItemURL || DEFAULT_IMAGE,

        location: {
          type:        "Point",
          coordinates: [s.AddressInfo.Longitude, s.AddressInfo.Latitude],
        },

        address: {
          city:    s.AddressInfo.Town              || "Unknown",
          state:   s.AddressInfo.StateOrProvince   || "Unknown",
          country: "India",
        },

        chargers: [{
          type:  s.Connections?.[0]?.ConnectionType?.Title || "Unknown",
          power: s.Connections?.[0]?.PowerKW              || 50,
          totalPorts:     2,
          availablePorts: 2,
        }],

        status:        "approved",
        isVerified:    true,
        averageRating: 0,
        reviewCount:   0,

        // proper ObjectId
        createdBy: new mongoose.Types.ObjectId("000000000000000000000000"),
      }));

    // ordered:false so one bad doc doesn't stop the rest
    await EVStation.insertMany(formattedStations, { ordered: false });
    console.log(`Imported ${formattedStations.length} stations`);

    await mongoose.disconnect();
    console.log("🔌 Done!");
    process.exit();

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

importChargers();
