const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject"
        },

        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty"
        },

        type: {
            type: String,
            enum: ["Notes", "PDF", "Video", "Link", "Other"],
            default: "Notes"
        },

        url: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Material", materialSchema);