const express = require("express");

const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getStudents);
router.get("/:id", getStudent);
router.post("/", canEdit, createStudent);
router.put("/:id", canEdit, updateStudent);
router.delete("/:id", canEdit, deleteStudent);

module.exports = router;