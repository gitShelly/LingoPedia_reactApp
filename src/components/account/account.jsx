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
  const { user, handleLogout } = useContext(UserContext);
  const [feedback, setFeedback] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [PdfFiles, setPrivatePdfFiles] = useState([]);
  const arrow = " <<< ";
  const [originalRecords, setOriginalRecords] = useState([]);
  const [showLanguageFilter, setShowLanguageFilter] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const fetchPrivatePdfFiles = async () => {
    try {
      const response = await axios.get(`/fetch-private-files/${user._id}`);
      if (response.data.success) {
        console.log("hello");
        const fetchedPdfFiles = response.data.pdfFiles;
        setPrivatePdfFiles(fetchedPdfFiles);
      } else {
        console.error("Failed to fetch private PDF files");
      }
    } catch (error) {
      console.error("Error fetching private PDF files:", error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchPrivatePdfFiles();
    }
  }, [user]);

  const handlepublicupdate = async (filename, lang) => {
    try {
      const response = await axios.post("/makePublic", {
        file_name: filename,
        lang: lang,
      });

      if (response.data.success) {
        alert("Document made public successfully");
      } else {
        alert("Error making public PDF file: " + response.data.error);
      }
    } catch (error) {
      alert("Error making public PDF file: " + error.message);
    }
  };

  const handledelete = async (filename) => {
    try {
      console.log(user.userType);
      const response = await axios.delete(`/delete-pdf`, {
        data: {
          file_name: filename,
          isAdmin: user.userType,
          userid: user._id,
        },
      });
      if (response.data.success) {
        const updatedPdfFiles = PdfFiles.filter(
          (pdfFile) => pdfFile.filename !== filename
        );
        setPrivatePdfFiles(updatedPdfFiles);
        alert("Successfully deleted");
      } else {
        console.error("Failed to delete PDF file:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting PDF file:", error.message);
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

      if (selectedFlag && startDate && endDate) {
        return matchesLanguage && withinDateRange;
      } else if (selectedFlag && !startDate && !endDate) {
        return matchesLanguage;
      } else if (startDate && endDate) {
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
    setStartDate(null);
    setEndDate(null);
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
        setStartDate(value ? moment(value) : null);
      } else if (name === "endDate") {
        setEndDate(value ? moment(value) : null);
      }
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
            value={startDate ? startDate.format("YYYY-MM-DD") : ""}
            placeholder="From"
            onChange={handleDate}
            className="startDate"
          />
          <label>To:</label>
          <input
            type="date"
            name="endDate"
            placeholder="To"
            value={endDate ? endDate.format("YYYY-MM-DD") : ""}
            onChange={handleDate}
            className="endDate"
          />
        </div>

        <div className="filter-btn">
          <button onClick={applyFilters}>Apply Filters</button>
          <button className="reset" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>
    );
  };
  const toggleLanguageFilter = () => {
    setShowLanguageFilter(!showLanguageFilter);
  };

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
    toggleLanguageFilter(); // Close the language filter dialog after
  };

  const handleShowAll = () => {
    setSelectedLanguage(null);
    toggleLanguageFilter();
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
      const response = await axios.get(`/record-fetch/${user._id}`);
      console.log(response);
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
    if (user && user._id) {
      fetchRecords();
    }
  }, [user]);

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
              <button className="filter-button" onClick={toggleFilterModal}>
                Filters
              </button>
            </div>
            <div className="performance_content">
              <div className="content_image">
                <img src={progress} alt="" id="progress" />
              </div>
              <div className="record">
                <div className="headingggg">
                  <div className="grid_heading">Language</div>
                  <div className="grid_heading" id="marks_obt">
                    Marks Obtained
                  </div>
                  <div className="grid_heading">Attempted Time and Date</div>
                </div>
                <div className="grid-container">
                  {records.length === 0 ? (
                    <div className="no-records">No record history</div>
                  ) : (
                    records.map((record, index) => (
                      <Fragment key={index}>
                        <div className="grid-item">{record.languageName}</div>
                        <div className="grid-item">{record.marks}/7</div>
                        <div className="grid-item">{record.date}</div>
                      </Fragment>
                    ))
                  )}
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
            <span id="profile_name">{user.name}</span>
            <span id="profile_mail">{user.email}</span>
            <button className="logout" onClick={handleLogout}>
              logout
            </button>
          </div>

          <div className="pdf-container-account">
            <div className="account_heading" id="pdf-title">
              <span id="arrow">{arrow}</span>
              <span id="pdf-heading">Your Uploads</span>
              <div className="pdf-filter">
                <span id="all">
                  {selectedLanguage ? selectedLanguage : "All"}
                </span>
                  {PdfFiles.length >0 &&(
                  <button
                    className="pdf-filter-btn"
                    onClick={toggleLanguageFilter}
                  >
                    &#9660;
                  </button>
                  )}
              </div>
              {showLanguageFilter && (
                <div className="language-filter-dialog">
                  {imports.map((lang) => (
                    <div
                      className="flag_lang"
                      key={lang.id}
                      onClick={() => handleLanguageClick(lang.title)}
                    >
                      <img
                        src={lang.flag}
                        alt={lang.title}
                        className="flag-image"
                      />
                    </div>
                  ))}
                  <button className="clear-btn" onClick={handleShowAll}>
                    Clear
                  </button>
                </div>
              )}
            </div>
            {PdfFiles.length > 0 ? (
              <>
                {PdfFiles.map((pdfFile, index) => {
                  if (
                    !selectedLanguage ||
                    imports[pdfFile.lang].title === selectedLanguage
                  ) {
                    return (
                      <div key={index} className="pdf-item">
                        <embed
                          className="uploads-pdfs-fetch"
                          src={URL.createObjectURL(
                            new Blob([pdfFile.data], {
                              type: pdfFile.contentType,
                            })
                          )}
                          width="100%"
                          type="application/pdf"
                        />
                        <span className="embedview">
                          <img
                            src={imports[pdfFile.lang].flag}
                            alt="flag"
                            style={{
                              width: "10%",
                              height: "10%",
                              marginRight: "1px",
                            }}
                          />
                          <span id="file-name">{pdfFile.filename}</span>
                          <div className="dropdown">
                            <div className="dropdown-trigger">
                              <span
                                className="dots"
                                aria-label="more options"
                                aria-haspopup="true"
                                aria-controls={`dropdown-menu-${index}`}
                              >
                                ...
                              </span>
                            </div>
                            <div
                              className="dropdown-menu"
                              id={`dropdown-menu-${index}`}
                              role="menu"
                            >
                              <div className="dropdown-content">
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handlepublicupdate(
                                      pdfFile.filename,
                                      pdfFile.lang
                                    )
                                  }
                                >
                                  make it public
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handledelete(pdfFile.filename)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </span>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
                {selectedLanguage  && !PdfFiles.some(
                  (pdfFile) => imports[pdfFile.lang].title === selectedLanguage
                ) && (
                  <span id="no-lang-pdf">
                    No files uploaded for this language.
                  </span>
                )}
              </>
            ) : (
              <div className="no-pdf">
                <span>You have not uploaded anything yet!!</span>
              </div>
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
