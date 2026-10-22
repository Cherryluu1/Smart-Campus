const express = require("express");

const {
    getAttendance,
    getAttendanceRecord,
    createAttendance,
    updateAttendance,
    deleteAttendance
} = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getAttendance);
router.get("/:id", getAttendanceRecord);
router.post("/", canEdit, createAttendance);
router.put("/:id", canEdit, updateAttendance);
router.delete("/:id", canEdit, deleteAttendance);

module.exports = router;