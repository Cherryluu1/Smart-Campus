const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "General",
                "Academic",
                "Exam",
                "Event",
                "Placement",
                "Important"
            ],
            default: "General"
        },

        targetRole: {
            type: String,
            enum: ["All", "Students", "Faculty", "Admin"],
            default: "All"
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Notification", notificationSchema);