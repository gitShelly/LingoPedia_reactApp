import { useContext, useState } from "react";
import { UserContext } from "../usercontext";
import { Navigate } from "react-router-dom";
import { Navbar } from "../nav_bar/nav2";
import axios from "axios";

import profile from "../../Assets/dashboard/graduate.png";
import progress from "../../Assets/dashboard/progress.jpg";
import "./account.css";
export const Account = () => {
  const { user, setuser } = useContext(UserContext);
  const [isredirect, setisredirect] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleFeedbackChange = (event) => {
      setFeedback(event.target.value);
  };

  const handleSubmitFeedback = async () => {
      try {
          const response = await axios.post("/submit-feedback", {
              userId: user._id,
              feedback: feedback
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

  if (isredirect) {
    return <Navigate to={isredirect} />;
  }
  return (
    <div className="main_">
      <Navbar />
      <div className="main_box">
        <div className="left_contain">
          <div className="performance">
            <div id="performance_filter">
              <span className="account_heading">
                Performance Metrics<span id="arrow">>>></span>
              </span>
              <span>Filters</span>
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

                  <div className="grid-item">English</div>
                  <div className="grid-item">85</div>
                  <div className="grid-item">{new Date().toLocaleString()}</div>

                  <div className="grid-item">Spanish</div>
                  <div className="grid-item">78</div>
                  <div className="grid-item">{new Date().toLocaleString()}</div>

                  <div className="grid-item">French</div>
                  <div className="grid-item">92</div>
                  <div className="grid-item">{new Date().toLocaleString()}</div>

                  <div className="grid-item">German</div>
                  <div className="grid-item">88</div>
                  <div className="grid-item">{new Date().toLocaleString()}</div>

                  <div className="grid-item">Japanese</div>
                  <div className="grid-item">95</div>
                  <div className="grid-item">{new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="feedback_box">
              <span className="account_heading">
                Feedback<span id="arrow">>>></span>
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
    </div>
  );
};
