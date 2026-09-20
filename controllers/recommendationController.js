const {
  getRecommendationsForUser,
} = require("../services/recommendationService");

const getRecommendations = async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit);
    const limit =
      Number.isInteger(requestedLimit) &&
      requestedLimit > 0
        ? Math.min(requestedLimit, 50)
        : 10;

    const recommendations =
      await getRecommendationsForUser(
        req.user._id,
        limit
      );

    return res.status(200).json({
      success: true,
      message: "Recommendations retrieved successfully",
      data: {
        count: recommendations.length,
        recommendations,
      },
    });
  } catch (error) {
    console.error("Recommendation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve recommendations",
      data: null,
    });
  }
};

module.exports = {
  getRecommendations,
};