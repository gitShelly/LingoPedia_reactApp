import { useContext, useState ,useEffect} from "react";
import { UserContext } from "../usercontext";
import { Navigate } from "react-router-dom";
import { Nav } from "../nav_bar/Nav";
import axios from "axios";

import profile from "../../Assets/dashboard/graduate.png";

import "./account.css";
import "./admin.css";


export const Admin = () => {
  const { user, setuser } = useContext(UserContext);
  const [isredirect, setisredirect] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  const logout = async () => {
    await axios.post("/logout");
    setisredirect("/");
    setuser(null);
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get("/fetch-feedback");
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);


  if (isredirect) {
    return <Navigate to={isredirect} />;
  }
  return (
    <div className="main_">
      <Nav />
      <div className="main_box">
        <div className="left_containadmin"></div>

        <div className="right_containadmin">
          <div className="right_contain_box1">
            <img src={profile} alt="profile" id="profile_image" />
            <span id="profile_name">avishi</span>
            <span id="profile_mail">a@gmail.com</span>
            <button className="logout" onClick={logout}>
              logout
            </button>
          </div>
          <div className="right_contain_box2">
            <span className="account_heading">
              User Feedbacks<span id="arrow">>>></span>
            </span>
            <div className="feedback_list">
              {feedbacks.map((feedback, index) => (
                <div className="feedback_entry" key={index}>
                  <div id="feedbacker">{feedback.name}</div>
                  <div>{feedback.feedback}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
