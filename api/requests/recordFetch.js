const RecordModel = require("../models/marksrecord");

const recordFetch = async (req, res) => {
  try {
    const records = await RecordModel.find().sort({ date: -1 }).limit(6);
    res.json({ success: true, data: records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
}

module.exports = recordFetch;
    