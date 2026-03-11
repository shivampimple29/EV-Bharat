require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const DB_URL = process.env.ATLASDB_URL;
const DEFAULT_IMAGE = "/images/ev-station-default.jpeg";
const EVStation = require("../models/evStation.model");

async function importChargers() {
  try {
    await mongoose.connect(DB_URL);

    console.log("MongoDB connected");

    const response = await axios.get(
      `https://api.openchargemap.io/v3/poi/?output=json&countrycode=IN&maxresults=1200&key=${process.env.OPENCHARGEMAP_API_KEY}`,
    );

    const stations = response.data;

    const formattedStations = stations
      .filter((station) => station.AddressInfo && station.AddressInfo.Latitude)
      .map((station) => ({
        name: station.AddressInfo.Title || "EV Charging Station",

        operator: station.OperatorInfo ? station.OperatorInfo.Title : "Unknown",

        location: {
          type: "Point",
          coordinates: [
            station.AddressInfo.Longitude,
            station.AddressInfo.Latitude,
          ],
        },

        address: {
          city: station.AddressInfo.Town || "Unknown",
          state: station.AddressInfo.StateOrProvince || "Unknown",
          country: "India",
        },

        image: station.MediaItems?.[0]?.ItemURL || DEFAULT_IMAGE,
        chargers: [
          {
            type:
              station.Connections && station.Connections[0]
                ? station.Connections[0].ConnectionType.Title
                : "Unknown",

            power:
              station.Connections && station.Connections[0]
                ? station.Connections[0].PowerKW || 50
                : 50,

            totalPorts: 2,
            availablePorts: 2,
          },
        ],

        status: "approved",
        isVerified: true,

        averageRating: 0,
        reviewCount: 0,

        createdBy: "000000000000000000000000",
      }));

    await EVStation.insertMany(formattedStations);

    console.log(`Imported ${formattedStations.length} stations`);

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

importChargers();
