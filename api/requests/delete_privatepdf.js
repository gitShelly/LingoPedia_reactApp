const PrivateModel = require('../models/privatePdf');
const PublicModel = require('../models/publicPdf');

// Route to delete a PDF file by filename
const privatedelete= async (req, res) => {
try {
    const { file_name ,isAdmin,userid} = req.body;

    if(isAdmin==="user"){
      const existingPrivatePDF = await PrivateModel.findOne({
        "pdf.filename": file_name,
        "userId": userid
      });
      
      if (!existingPrivatePDF && !userid){
        return res.status(404).json({ success: false, message: 'PDF file not found' });
      }

      
      const deletedPdf = await PrivateModel.deleteOne({ userId:userid,"pdf.filename":file_name });
      
      if (deletedPdf.deletedCount > 0) {
        return res.status(200).json({ success: true, message: 'PDF file(s) deleted successfully' });
      } else {
        return res.status(404).json({ success: false, message: 'PDF file(s) not found' });
      }
    }else{
      const deletedPdf = await PublicModel.deleteOne({ userId:userid,"pdf.filename":file_name });
      
      if (deletedPdf.deletedCount > 0) {
        return res.status(200).json({ success: true, message: 'PDF file(s) deleted successfully' });
      } else {
        return res.status(404).json({ success: false, message: 'PDF file(s) not found' });
      }

    }
    }
     catch (error) {
      console.error('Error deleting PDF file:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  
};

module.exports = privatedelete;
