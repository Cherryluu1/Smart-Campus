const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        studentId: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department"
        },

        year: {
            type: Number
        },

        semester: {
            type: Number
        },

        section: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);