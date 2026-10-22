const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        time: {
            type: String
        },

        duration: {
            type: Number, // in minutes
        },

        venue: {
            type: String,
            trim: true
        },

        type: {
            type: String,
            enum: ["Mid-Term", "End-Term", "Quiz", "Practical", "Other"],
            default: "Other"
        },

        totalMarks: {
            type: Number
        },

        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.models.Exam || mongoose.model("Exam", examSchema);