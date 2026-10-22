const express = require("express");

const {
    getSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getSubjects);
router.get("/:id", getSubject);
router.post("/", canEdit, createSubject);
router.put("/:id", canEdit, updateSubject);
router.delete("/:id", canEdit, deleteSubject);

module.exports = router;