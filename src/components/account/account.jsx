import { useContext, useState } from "react";
import { UserContext } from "../usercontext";
import { Navigate } from "react-router-dom";
import { Navbar } from "../nav_bar/nav2";
import axios from "axios";
import "./account.css";
export const Account = () => {
  const { user, setuser } = useContext(UserContext);
  const [isredirect, setisredirect] = useState(null);
  const [feedback, setFeedback] = useState('');
  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };
  const handleSubmitFeedback = () => {
    // Here you can implement the logic to submit the feedback
    console.log('Feedback submitted:', feedback);
    // Optionally, you can clear the feedback after submission
    setFeedback('');
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
      <div className="contain">
        <div className="first_row">
          <p className="account_heading">
            Performance Metrics<span id="arrow">>>></span>
          </p>
          <div className="box1">
            <div className="content_box1"></div>
          </div>
        </div>
        <div className="first_row2">
          <p>user image </p>
          <p>{user.name}</p>
          <p>{user.email}</p>

          <button className="logout" onClick={logout}>logout</button>
        </div>
      </div>

      <div className="contain">
        <div className="first_row">
          <p className="account_heading">
            Feedback<span id="arrow">>>></span>
          </p>
          <div className="box1">
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Enter your feedback here..."
              rows={10}
              cols={100}
            />
            <br />
            <button className="feedback" onClick={handleSubmitFeedback} >Submit Feedback</button>
          </div>
        </div>
        <div className="first_row3">
          <p className="account_heading">
            Your Notes<span id="arrow">>>></span>
          </p>
        </div>
      </div>
    </div>
  );
};
