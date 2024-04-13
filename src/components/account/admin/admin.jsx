import { useContext, useState } from "react";
import { UserContext } from "../../usercontext";
import { Navigate } from "react-router-dom";
import { Nav } from "../../nav_bar/Nav"
import axios from "axios";
import profile from "../../../Assets/dashboard/unauthorized-person.png";

import "../account.css";

export const Admin = () => {
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
      <Nav />
      <div className="main_box">
        <div className="left_contain">
            language selection flags
            <br/>
            video add
            <br/>
            video delete
            <br/>
            notes delete

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
          <div>feedback</div>
        </div>
      </div>
    </div>
  );
};
