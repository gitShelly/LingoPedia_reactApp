const RecordModel = require("../models/marksrecord");

const recordFetch = async (req, res) => {
  const { userid } = req.params;
  // console.log(userid);
  try {
    const records = await RecordModel.find({ userId: userid })
      .sort({ date: -1 })
      .limit(6);
    res.json({ success: true, data: records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = recordFetch;
