const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
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
            ref: "Subject",
            required: true
        },

        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty"
        },

        dueDate: {
            type: Date,
            required: true
        },

        maxMarks: {
            type: Number,
            default: 100
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Assignment", assignmentSchema);