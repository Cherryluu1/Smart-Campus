const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: Date,
      required: true
    },

    venue: {
      type: String,
      required: true,
      trim: true
    },

    organizer: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      default: "General"
    },

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming"
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.models.Event || mongoose.model("Event", eventSchema);