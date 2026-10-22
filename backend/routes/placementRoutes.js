const express = require("express");

const {
    getPlacements,
    getPlacement,
    createPlacement,
    updatePlacement,
    deletePlacement
} = require("../controllers/placementController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getPlacements);
router.get("/:id", getPlacement);
router.post("/", canEdit, createPlacement);
router.put("/:id", canEdit, updatePlacement);
router.delete("/:id", canEdit, deletePlacement);

module.exports = router;