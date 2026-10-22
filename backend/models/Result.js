const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },

        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam"
        },

        marks: {
            type: Number,
            required: true
        },

        maxMarks: {
            type: Number,
            default: 100
        },

        grade: {
            type: String
        },

        semester: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Result", resultSchema);