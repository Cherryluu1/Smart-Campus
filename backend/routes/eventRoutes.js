const express = require("express");

const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", canEdit, createEvent);
router.put("/:id", canEdit, updateEvent);
router.delete("/:id", canEdit, deleteEvent);

module.exports = router;