const FeedbackModel = require("../models/feedback");
const UserModel = require("../models/user");

const FeedbackRequest = async (req, res) => {
  try {
    const { userId, feedback } = req.body;

    // Fetch user details to get name
    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Create a new feedback document
    const newFeedback = new FeedbackModel({
      userId,
      name: user.name,
      feedback,
    });

    // Save the feedback to the database
    await newFeedback.save();

    res
      .status(200)
      .json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = FeedbackRequest;
