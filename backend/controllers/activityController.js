const Activity = require("../models/Activity");
const Item = require("../models/Item");

// RECORD USER ACTIVITY
const recordActivity = async (req, res) => {
  try {
    const { itemId, action } = req.body || {};

    if (!itemId || !action) {
      return res.status(400).json({
        success: false,
        message: "Item ID and action are required",
        data: null,
      });
    }

    const allowedActions = ["view", "click", "like", "save"];

    if (!allowedActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity action",
        data: null,
      });
    }

    const item = await Item.findById(itemId);

    if (!item || !item.isActive) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
        data: null,
      });
    }

    // Likes and saves should only exist once per user/item.
    if (action === "like" || action === "save") {
      const existingActivity = await Activity.findOne({
        user: req.user._id,
        item: item._id,
        action,
      });

      if (existingActivity) {
        return res.status(409).json({
          success: false,
          message: `You have already ${action}d this item`,
          data: null,
        });
      }
    }

    const activity = await Activity.create({
      user: req.user._id,
      item: item._id,
      action,
    });

    return res.status(201).json({
      success: true,
      message: "Activity recorded successfully",
      data: {
        activity,
      },
    });
  } catch (error) {
    if (error.code === 11000 && ["like", "save"].includes(req.body?.action)) {
      return res.status(409).json({
        success: false,
        message: `You have already ${req.body.action}d this item`,
        data: null,
      });
    }

    console.error("Record activity error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID",
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to record activity",
      data: null,
    });
  }
};


// GET LOGGED-IN USER ACTIVITY
const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user._id,
    })
      .populate(
        "item",
        "title type category tags price imageUrl"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Activities retrieved successfully",
      data: {
        count: activities.length,
        activities,
      },
    });
  } catch (error) {
    console.error("Get activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve activities",
      data: null,
    });
  }
};

const removeActivity = async (req, res) => {
  try {
    const { itemId, action } = req.body;

    if (!itemId || !action) {
      return res.status(400).json({
        success: false,
        message: "Item ID and action are required",
        data: null,
      });
    }

    // Only persistent actions can be removed
    const removableActions = ["like", "save"];

    if (!removableActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Only like or save activities can be removed",
        data: null,
      });
    }

    const activity = await Activity.findOneAndDelete({
      user: req.user._id,
      item: itemId,
      action,
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: `${action} activity not found`,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        action === "like"
          ? "Item unliked successfully"
          : "Item unsaved successfully",
      data: null,
    });
  } catch (error) {
    console.error("Remove activity error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID",
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to remove activity",
      data: null,
    });
  }
};

module.exports = {
  recordActivity,
  getMyActivities,
  removeActivity,
};
