import { useContext, useState, useEffect, Fragment } from "react";
import { UserContext } from "../usercontext";
import { Navigate } from "react-router-dom";
import { Navbar } from "../nav_bar/nav2";
import { imports } from "../dashboard_WantToLearn/Images"; // Import the language imports array
import axios from "axios";
import moment from "moment";

import profile from "../../Assets/dashboard/graduate.png";
import progress from "../../Assets/dashboard/progress.jpg";
import "./account.css";

export const Account = () => {
  const { user, setuser } = useContext(UserContext);
  const [isredirect, setisredirect] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState(moment().startOf("day"));
  const [endDate, setEndDate] = useState(moment().endOf("day"));
  const [originalRecords, setOriginalRecords] = useState([]);


  // const { langid } = useContext(LangContext);
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

  const logout = async () => {
    await axios.post("/logout");
    setisredirect("/");
    setuser(null);
  };
  const fetchRecords = async () => {
    try {
      const response = await axios.get(`/record-fetch/${user.id}`);
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
  }, [user.id]);

  if (isredirect) {
    return <Navigate to={isredirect} />;
  }

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
            <span id="profile_name">{user.name}</span>
            <span id="profile_mail">{user.email}</span>
            <button className="logout" onClick={logout}>
              logout
            </button>
          </div>
          {/* <div>uploads</div> */}
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
