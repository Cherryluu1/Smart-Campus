const express = require("express");

const {
    getExams,
    getExam,
    createExam,
    updateExam,
    deleteExam
} = require("../controllers/examController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getExams);
router.get("/:id", getExam);
router.post("/", canEdit, createExam);
router.put("/:id", canEdit, updateExam);
router.delete("/:id", canEdit, deleteExam);

module.exports = router;