const express = require("express");

const {
    getFaculty,
    getFacultyMember,
    createFaculty,
    updateFaculty,
    deleteFaculty
} = require("../controllers/facultyController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getFaculty);
router.get("/:id", getFacultyMember);
router.post("/", canEdit, createFaculty);
router.put("/:id", canEdit, updateFaculty);
router.delete("/:id", canEdit, deleteFaculty);

module.exports = router;