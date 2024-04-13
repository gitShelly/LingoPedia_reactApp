import { useContext} from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import download from "../../Assets/upload page/download.png";
import LangContext from "../../langProvider.js";

export const UploadNotes = () => {
  const { pdf } = useContext(LangContext);

  const navigate = useNavigate();
  const handleLinkClick = () => {
    navigate("/upload");
  };

  const handleEmbedClick = (file) => {
    const pdfUrl = URL.createObjectURL(file);
    window.open(pdfUrl, "_blank");
  };
  return (
    <div className="uploads">
        <div className="pdf-container"  >
          {pdf && pdf.type === "application/pdf" ? (
            <>
             <embed
             src={URL.createObjectURL(pdf)}
             width="100%"
             height="100%"
             type="application/pdf"
           />
           <span className="embedview" onClick={() => handleEmbedClick(pdf)}>view</span>
           </>
         ) : null}
        </div>

      <div className="uploadzone">
        <div className="button" onClick={handleLinkClick}>
          <img src={download} alt="download" className="download"/>
        </div>
      </div>
    </div>

  );
};