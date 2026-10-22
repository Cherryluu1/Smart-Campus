const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        code: {
            type: String,
            required: true,
            unique: true
        },

        credits: {
            type: Number,
            default: 3
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department"
        },

        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty"
        },

        semester: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Subject", subjectSchema);