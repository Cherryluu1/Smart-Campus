const express = require("express");

const {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require("../controllers/departmentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getDepartments);
router.get("/:id", getDepartment);
router.post("/", canEdit, createDepartment);
router.put("/:id", canEdit, updateDepartment);
router.delete("/:id", canEdit, deleteDepartment);

module.exports = router;