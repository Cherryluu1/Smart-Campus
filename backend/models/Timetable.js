const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            required: true
        },

        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },

        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty"
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        room: {
            type: String
        },

        section: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Timetable", timetableSchema);