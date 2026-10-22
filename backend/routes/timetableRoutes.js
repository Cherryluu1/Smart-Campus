const express = require("express");

const {
    getTimetables,
    getTimetable,
    createTimetable,
    updateTimetable,
    deleteTimetable
} = require("../controllers/timetableController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getTimetables);
router.get("/:id", getTimetable);
router.post("/", canEdit, createTimetable);
router.put("/:id", canEdit, updateTimetable);
router.delete("/:id", canEdit, deleteTimetable);

module.exports = router;