const express = require("express");

const {
    getMaterials,
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial
} = require("../controllers/materialController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getMaterials);
router.get("/:id", getMaterial);
router.post("/", canEdit, createMaterial);
router.put("/:id", canEdit, updateMaterial);
router.delete("/:id", canEdit, deleteMaterial);

module.exports = router;