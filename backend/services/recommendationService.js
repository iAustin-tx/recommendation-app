const Activity = require("../models/Activity");
const Item = require("../models/Item");

// Activity importance
const ACTION_WEIGHTS = {
  view: 1,
  click: 2,
  save: 3,
  like: 4,
};

const getRecommendationsForUser = async (userId, limit = 10) => {
  // Get user's activity and the associated items
  const activities = await Activity.find({
    user: userId,
  }).populate("item");

  // No activity yet: return newest active items
  if (activities.length === 0) {
    return Item.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  const categoryScores = {};
  const tagScores = {};
  const typeScores = {};

  const interactedItemIds = new Set();

  // Build preference scores
  for (const activity of activities) {
    if (!activity.item) continue;

    const item = activity.item;
    const weight = ACTION_WEIGHTS[activity.action] || 1;

    interactedItemIds.add(item._id.toString());

    // Category preference
    if (item.category) {
      categoryScores[item.category] =
        (categoryScores[item.category] || 0) + weight;
    }

    // Type preference
    if (item.type) {
      typeScores[item.type] =
        (typeScores[item.type] || 0) + weight;
    }

    // Tag preferences
    if (item.tags && Array.isArray(item.tags)) {
      for (const tag of item.tags) {
        tagScores[tag] =
          (tagScores[tag] || 0) + weight;
      }
    }
  }

  // Get possible recommendation candidates
  const candidates = await Item.find({
    isActive: true,
    _id: {
      $nin: Array.from(interactedItemIds),
    },
  });

  // Score every candidate
  const scoredItems = candidates.map((item) => {
    let score = 0;

    // Matching category
    if (categoryScores[item.category]) {
      score += categoryScores[item.category] * 3;
    }

    // Matching item type
    if (typeScores[item.type]) {
      score += typeScores[item.type];
    }

    // Matching tags
    for (const tag of item.tags || []) {
      if (tagScores[tag]) {
        score += tagScores[tag] * 2;
      }
    }

    return {
      item,
      score,
    };
  });

  // Highest score first
  scoredItems.sort((a, b) => b.score - a.score);

  // Only recommend positively matched items
  const recommendations = scoredItems
    .filter((result) => result.score > 0)
    .slice(0, limit)
    .map((result) => ({
      ...result.item.toObject(),
      recommendationScore: result.score,
    }));

  return recommendations;
};

module.exports = {
  getRecommendationsForUser,
};