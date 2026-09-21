const express = require("express");

const {
  recordActivity,
  getMyActivities,
  removeActivity,
} = require("../controllers/activityController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All activity routes require login
router.post("/", protect, recordActivity);

router.get("/me", protect, getMyActivities);

router.delete("/", protect, removeActivity);

module.exports = router;
