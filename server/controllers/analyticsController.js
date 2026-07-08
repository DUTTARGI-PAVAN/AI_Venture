const { getAnalytics } = require("../services/analyticsService");

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await getAnalytics(
      req.params.projectId,
      req.user.id
    );

    res.json({
      success: true,
      analytics,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};