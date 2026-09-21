const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: ["view", "click", "like", "save"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index(
  { user: 1, item: 1, action: 1 },
  {
    name: "unique_user_item_like_save",
    unique: true,
    partialFilterExpression: { action: { $in: ["like", "save"] } },
  }
);

module.exports = mongoose.model("Activity", activitySchema);
