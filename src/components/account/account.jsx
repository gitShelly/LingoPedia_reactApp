import { useContext, useState } from "react";
import { UserContext } from "../usercontext";
import { Navigate } from "react-router-dom";
import { Navbar } from "../nav_bar/nav2";
import axios from "axios";
import "./account.css";
export const Account = () => {
  const { user, setuser } = useContext(UserContext);
  const [isredirect, setisredirect] = useState(null);

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
          <p className="course_heading">
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

          <button onClick={logout}>logout</button>
        </div>
      </div>

      <div className="contain">
        <div className="first_row">
          <p className="course_heading">
            Feedback<span id="arrow">>>></span>
          </p>
          <div className="box1">
            <textarea
              value=""
              placeholder="Enter your feedback here..."
              rows={5}
              cols={100}
            />
            <br />
            <button>Submit Feedback</button>
          </div>
        </div>
        <div className="first_row2">
          <p className="course_heading">
            Your Notes<span id="arrow">>>></span>
          </p>
        </div>
      </div>
    </div>
  );
};
