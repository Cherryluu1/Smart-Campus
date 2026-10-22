const express = require("express");

const {
    getNotifications,
    getNotification,
    createNotification,
    updateNotification,
    deleteNotification
} = require("../controllers/notificationController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getNotifications);
router.get("/:id", getNotification);
router.post("/", canEdit, createNotification);
router.put("/:id", canEdit, updateNotification);
router.delete("/:id", canEdit, deleteNotification);

module.exports = router;