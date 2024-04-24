import { useContext, useState, useEffect, Fragment } from "react";
import { UserContext } from "../usercontext";
// import { Navigate } from "react-router-dom";
import { Navbar } from "../nav_bar/nav2";
import { imports } from "../dashboard_WantToLearn/Images"; 
import axios from "axios";
import moment from "moment";

import profile from "../../Assets/dashboard/graduate.png";
import progress from "../../Assets/dashboard/progress.jpg";
import "./account.css";

export const Account = () => {
  const { user,handleLogout } = useContext(UserContext);
  const [feedback, setFeedback] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState(moment().startOf("day"));
  const [endDate, setEndDate] = useState(moment().endOf("day"));
  const [PdfFiles, setPrivatePdfFiles] = useState([]);
  const arrow=" <<< ";
  const [originalRecords, setOriginalRecords] = useState([]);


  // const { langid } = useContext(LangContext);

  useEffect(() => {
    // Fetch the uploaded PDF files from the server based on userId
    const fetchPrivatePdfFiles = async () => {
      try {
        const response = await axios.get(`/fetch-private-files/`, {
          userId: user._id,
        });
        if (response.data.success) {
          const fetchedPdfFiles = response.data.pdfFiles; // Assuming server sends the array of PDF files
          setPrivatePdfFiles(fetchedPdfFiles);
        } else {
          console.error("Failed to fetch private PDF files");
        }
      } catch (error) {
        console.error("Error fetching private PDF files:", error);
      }
    };

    fetchPrivatePdfFiles();
  }, []);


  // const handleEmbedClick = (privatePdfFile) => {
  //   // Convert buffer data to a Uint8Array
  //   const uint8Array = new Uint8Array(privatePdfFile.data.data);

  //   // Create a Blob object from Uint8Array with filename
  //   const pdfBlob = new Blob([uint8Array], {
  //     type: privatePdfFile.contentType,
  //   });

  //   // Create a URL for the Blob object
  //   const pdfUrl = URL.createObjectURL(pdfBlob);

  //   // Open the PDF file in a new window with filename
  //   const newWindow = window.open(pdfUrl, "_blank");
  //   if (newWindow) {
  //     newWindow.document.title = privatePdfFile.filename;
  //   } else {
  //     console.error("Failed to open private PDF in new window");
  //   }
  // };

  const handledelete = async (filename) => {
    try {
     
      const response = await axios.delete(`/delete-private-pdf`,{file_name:filename});
      if (response.data.success) {
        const updatedPdfFiles = PdfFiles.filter(pdfFile => pdfFile.filename !== filename);
        setPrivatePdfFiles(updatedPdfFiles);
        alert('Successfully deleted')
      } else {
        console.error('Failed to delete PDF file:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting PDF file:', error.message);
    }
  };
  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
    setIsBackgroundBlurred(!isBackgroundBlurred);
  };

  const applyFilters = () => {
    const filteredRecords = originalRecords.filter((record) => {
      
      const matchesLanguage = selectedFlag
        ? record.languageName === selectedFlag
        : true;

      const recordDate = moment(record.date);
      const withinDateRange = recordDate.isBetween(
        startDate,
        endDate,
        null,
        "[]"
      );
      
     if (selectedFlag && (startDate   && endDate)) {
      return matchesLanguage && withinDateRange;
    } else if (selectedFlag  && !startDate && !endDate) {
      return matchesLanguage ;
    } else if ( startDate && endDate) {
      return withinDateRange;
    } else {
      return true;
    }
    });

    setRecords(filteredRecords);
    toggleFilterModal();
  };

  const resetFilters = () => {
    setSelectedFlag(null);
    setStartDate(moment().startOf("day"));
    setEndDate(moment().endOf("day"));
    fetchRecords();
    toggleFilterModal();
  };

  const FilterModal = ({
    imports,
    selectedFlag,
    setSelectedFlag,
    applyFilters,
    resetFilters,
    startDate,
    endDate,
  }) => {
    const handleDate = (event) => {
      const { name, value } = event.target;
      if (name === "startDate") {
        setStartDate(moment(value));
      } else if (name === "endDate") {
        setEndDate(moment(value));
      }
    };
    const filterData = () => {
      filterData(startDate, endDate);
    };
    return (
      <div className="filter-modal dialog-box">
        <h3>Filter by Language</h3>
        <div className="lang_filter">
          {imports.map((lang) => (
            <div
              className="flag_lang"
              key={lang.id}
              onClick={() => setSelectedFlag(lang.title)}
            >
              <div className="flag-circle">
                <img src={lang.flag} alt={lang.title} className="flag-image" />
              </div>
              <div
                className={`language-name ${
                  selectedFlag === lang.title ? "selected-text" : ""
                }`}
              >
                {lang.title}
              </div>
            </div>
          ))}
        </div>
        {/* Date filter */}
        <h3 className="date-h3">Filter by Date</h3>
        <div className="date-filters">
          <label>From:</label>
          <input
            type="date"
            name="startDate"
            value={startDate.format("YYYY-MM-DD")}
            placeholder="From"
            onChange={handleDate}
            className="startDate"
          />
          <label>To:</label>
          <input
            type="date"
            name="endDate"
            placeholder="To"
            value={endDate.format("YYYY-MM-DD")}
            onChange={handleDate}
            className="endDate"
          />
        </div>
        {/* Apply and Reset buttons */}
        <div className="filter-btn">
          <button onClick={applyFilters}>Apply Filters</button>
          <button className="reset" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>
    );
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await axios.post("/submit-feedback", {
        userId: user.id,
        feedback: feedback,
      });

      if (response.data.success) {
        alert("Feedback submitted successfully");
        setFeedback("");
      } else {
        alert("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
    }
  };


  const fetchRecords = async () => {
    try {
      const response = await axios.get(`/record-fetch`,{
        userId: user.id
      });
      if (response.data.success) {
        setOriginalRecords(response.data.data);
        setRecords(response.data.data);
        console.log(response.data.data);
      } else {
        console.error("Failed to fetch records:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching records:", error.message);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user._id]);

  // if (isredirect) {
  //   return <Navigate to={isredirect} />;
  // }

  return (
    <div className={"main_"}>
      <Navbar />
      <div className="main_box">
        <div className="left_contain">
          <div className="performance">
            <div id="performance_filter">
              <span className="account_heading">
                Performance Metrics<span id="arrow">&gt;&gt;&gt;</span>
              </span>
              <button
                className="filter-button dialog-box"
                onClick={toggleFilterModal}
              >
                Filters
              </button>
            </div>
            <div className="performance_content">
              <div className="content_image">
                <img src={progress} alt="" id="progress" />
              </div>
              <div className="record">
                <div className="grid-container">
                  <div className="grid_heading">Language</div>
                  <div className="grid_heading">Marks Obtained</div>
                  <div className="grid_heading">Attempted Time and Date</div>

                  {records.map((record, index) => (
                    <Fragment key={index}>
                      <div className="grid-item">{record.languageName}</div>
                      <div className="grid-item">{record.marks}</div>
                      <div className="grid-item">{record.date}</div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="feedback_box">
              <span className="account_heading">
                Feedback<span id="arrow">&gt;&gt;&gt;</span>
              </span>
              <textarea
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="Enter your feedback here..."
                id="feedback_text"
              />
              <div id="button_div">
                <button className="feedback_btn" onClick={handleSubmitFeedback}>
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="right_contain">
          <div className="right_contain_box1">
            <img src={profile} alt="profile" id="profile_image" />
            <span id="profile_name">avishi</span>
            <span id="profile_mail">hbvjgvg</span>
            <button className="logout" onClick={handleLogout}>
              logout
            </button>
          </div>
          
          <div className="pdf-container-account">
            <span className="account_heading"><span id="arrow">{arrow}</span>
               Your Uploads<span id="arrow">&gt;&gt;&gt;</span></span>
            {console.log(PdfFiles.length)}
            {PdfFiles.length > 0 ? (
              <>
                {PdfFiles.map((pdfFile, index) => (
                  <div key={index} className="pdf-item">
                    <embed
                      className="uploads-pdfs-fetch"
                      src={URL.createObjectURL(
                        new Blob([pdfFile.data], { type: pdfFile.contentType })
                      )}
                      width="100%"
                      type="application/pdf"
                    />
                    <span
                      className="embedview"
                      
                    >
                      <span>{pdfFile.filename}</span>
                      <span id="viewww" onClick={()=>handledelete(pdfFile.filename)}>delete</span>
                    </span>
                  </div>
                ))}
              </>
            ) : (
                <span>You have not uploaded anything yet!!</span>
            )}
          </div>
        </div>
      </div>
      {showFilterModal && (
        <FilterModal
          closeModal={toggleFilterModal}
          imports={imports}
          selectedFlag={selectedFlag}
          setSelectedFlag={setSelectedFlag}
          startDate={startDate}
          endDate={endDate}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
        />
      )}
    </div>
  );
};
