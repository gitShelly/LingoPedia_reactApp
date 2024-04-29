const PrivateModel = require("../models/privatePdf");
const PublicModel = require("../models/publicPdf");

const makePublic = async (req, res) => {
  try {
    const { file_name } = req.body;

    const existingPublicPDF = await PublicModel.findOne({
      "pdf.filename": file_name,
    });
    if (existingPublicPDF) {
      return res.json({
        success: false,
        error: "Document already exists in public model",
      });
    }

    if (!existingPublicPDF) {
      const privatePDF = await PrivateModel.findOne({
        "pdf.filename": file_name,
      });

      if (privatePDF) {
        const { userId, lang, pdf } = privatePDF;
        console.log(userId, lang, pdf);
        const publicPDF = new PublicModel({ userId, lang, pdf });
        await publicPDF.save();
        return res.json({
          success: true,
          message: "Document uploaded to public list",
        });
      } else {
        console.log("Document not found in private model");
      }
    } else {
      return res.status(500).json({ success: false, error: "Server error" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = makePublic;
