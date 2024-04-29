import { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./dashboard.css";
import { UserContext } from "../usercontext";

export const UploadNotes = (props) => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const { user } = useContext(UserContext);

  const langid=props.lang

  useEffect(() => {
    // Fetch the uploaded PDF files from the server based on langid
    const fetchPdfFiles = async () => {
      try {
        const response = await axios.get(`/fetch-public-files/${langid}`);
        if (response.data.success) {
          const fetchedPdfFiles = response.data.pdfFiles; 
          setPdfFiles(fetchedPdfFiles);
        } else {
          console.error("Failed to fetch PDF files");
        }
      } catch (error) {
        console.error("Error fetching PDF files:", error);
      }
    };

    fetchPdfFiles();
  }, [langid]);

  const handledelete = async (filename) => {
    try {
      const response = await axios.delete(`/delete-pdf`, {
        file_name: filename,
        isAdmin:true
      });
      if (response.data.success) {
        const updatedPdfFiles = pdfFiles.filter(
          (pdfFile) => pdfFile.filename !== filename
        );
        setPdfFiles(updatedPdfFiles);
        alert("Successfully deleted");
      } else {
        console.error("Failed to delete PDF file:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting PDF file:", error.message);
    }
  };


  const handleEmbedClick = (pdfFile) => {
    
    console.log(pdfFile.filename)
    const uint8Array = new Uint8Array(pdfFile.data.data);


    const pdfBlob = new Blob([uint8Array], { type: pdfFile.contentType });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const newWindow = window.open(pdfUrl, "_blank");
    if (newWindow) {
        newWindow.document.title = pdfFile.filename;
        // console.log(newWindow.document)
    } else {
        console.error("Failed to open PDF in new window");
    }
};




  return (
    <div className="uploads">
      {pdfFiles.length > 0 ? (
        pdfFiles.map((pdfFile, index) => (
          <div key={index} className="pdf-container">
            <embed
              className="uploads-pdfs-fetch"
              src={URL.createObjectURL(new Blob([pdfFile.data.data], { type: pdfFile.contentType }))}
              
              // width="50%"
              // height="100%"
              src={URL.createObjectURL(new Blob([pdfFile.data], { type: pdfFile.contentType }))}
              // width="100%"
              // height="100%"
              type="application/pdf"
              onClick={() => handleEmbedClick(pdfFile)}
            />
            <span className="embedview" >
             <span onClick={() => handleEmbedClick(pdfFile)}id= "pdf-click">{pdfFile.filename}</span>{(user.userType==="admin")?<span id="viewww" onClick={()=>handledelete(pdfFile.filename)}>Delete</span>:null} 
            </span>
          </div>
        ))
      ) : (
        <div id="no-pdf">No PDF files available</div>
      )}
    </div>
  );
};
