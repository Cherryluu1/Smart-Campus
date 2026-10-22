const express = require("express");

const {
    getResults,
    getResult,
    createResult,
    updateResult,
    deleteResult
} = require("../controllers/resultController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route requires login; only admin/faculty may modify data
router.use(protect);
const canEdit = authorize("admin", "faculty");

router.get("/", getResults);
router.get("/:id", getResult);
router.post("/", canEdit, createResult);
router.put("/:id", canEdit, updateResult);
router.delete("/:id", canEdit, deleteResult);

module.exports = router;