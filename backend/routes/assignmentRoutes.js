const express = require("express");

const {
    getAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
} = require("../controllers/assignmentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getAssignments);
router.get("/:id", getAssignment);
router.post("/", canEdit, createAssignment);
router.put("/:id", canEdit, updateAssignment);
router.delete("/:id", canEdit, deleteAssignment);

module.exports = router;