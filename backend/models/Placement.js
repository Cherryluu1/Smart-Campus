const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true
        },

        jobRole: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        eligibility: {
            type: String
        },

        package: {
            type: String
        },

        location: {
            type: String
        },

        applicationDeadline: {
            type: Date
        },

        applicationLink: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Placement", placementSchema);