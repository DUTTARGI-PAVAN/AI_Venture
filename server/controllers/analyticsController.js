const analyticsService = require("../services/analyticsService");

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getAnalytics(req.user.id);

    res.json({
      success: true,
      analytics,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to load analytics. Please try again.",
    });
  }
};
