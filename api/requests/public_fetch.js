const PublicModel = require("../models/publicPdf");

const fetchpublicpdf = async (req, res) => {
  try {
    const langID = req.params.langID;
    const documents = await PublicModel.find({ lang: langID });

    const pdf_sum=await PublicModel.aggregate([{$group:{_id:"$lang",total_pdfs:{$sum:1}}}]).sort({_id:1})

    const lang_pdf_sum = pdf_sum.find(item => item._id === langID)?.total_pdfs || 0;

    if (!documents || documents.length === 0) {
      return res.status(404).json({ error: "PDFs not found" });
    }

    const pdfFiles = documents.map(doc => ({  
      filename: doc.pdf.filename,
      contentType: doc.pdf.contentType,
      data: doc.pdf.data
    }));

    

    res.json({ success: true, pdfFiles, lang_pdf_sum});
  } catch (error) {
    // console.error("Error fetching PDFs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetchpublicpdf;
