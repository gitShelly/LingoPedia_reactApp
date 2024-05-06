const PublicModel = require("../models/publicPdf");

const fetchpublicpdf = async (req, res) => {
  try {
    const langID = req.params.langID;
    const documents = await PublicModel.find({ lang: langID });

    const pdf_sum=await PublicModel.aggregate([{$group:{_id:"$lang",total_pdfs:{$sum:1}}}]).sort({_id:1})

    var lang_pdf_sum = 0;
    const n = pdf_sum.length;
    for (var i = 0; i < n; i++) {
        if (Number(pdf_sum[i]._id) === Number(langID)) {
            lang_pdf_sum = pdf_sum[i].total_pdfs;
            break; 
        }
    }
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
