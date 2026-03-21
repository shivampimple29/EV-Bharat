const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EVStation",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200, 
    },
  },
  { timestamps: true },
);

reviewSchema.index({ userId: 1, stationId: 1 }, { unique: true });

module.exports = reviewSchema;
