const mongoose = require("mongoose");

const chargerSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  power: {
    type: Number,
    required: true,
  },
  totalPorts: {
    type: Number,
    required: true,
  },
  availablePorts: {
    type: Number,
    required: true,
  },
});

const evStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    image: {
      type: String,
      default: "/images/ev-station-default.jpeg",
    },

    operator: String,

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],  // [longitude, latitude]
        required: true,
      },
    },

    address: {
      city:    String,
      state:   String,
      country: String,
    },

    chargers: [chargerSchema],

    amenities: [String],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // ✅ removed required:true — allows seeding without a user
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

evStationSchema.index({ location: "2dsphere" });

module.exports = evStationSchema;
