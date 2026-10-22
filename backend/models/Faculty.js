const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
    {
        facultyId: {
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

        designation: {
            type: String
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Faculty", facultySchema);