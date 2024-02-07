import React, { useState } from "react";
import logo3 from "../../Assets/Welcome page/logo4.svg";
import login from "../../Assets/Welcome page/signup.png";
import logo from "../../Assets/Welcome page/thinking.svg";
import email from "../../Assets/Welcome page/material-symbols_mail-outline.png";
import key from "../../Assets/Welcome page/carbon_password.png";
import eye from "../../Assets/Welcome page/el_eye-close (1).png";
import eye_open from "../../Assets/Welcome page/eye-open2.svg";
import user from "../../Assets/Welcome page/user.png"
import "./login.css";
import { Link } from "react-router-dom";

export const Register = () => {

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);


  function togglePasswordVisibility() {
    setIsPasswordFocused(true);
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.src = eye_open;
    } else {
      passwordInput.type = "password";
      eyeIcon.src = eye;
    }
  }

  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handleNameFocus = () => {
    setIsNameFocused(true);
  };

  const handleInputChange = (event, setState) => {
    const inputValue = event.target.value;
    setState(inputValue.length > 0);
  };

  return (
    <div className="login">
      <div className="login__left">
        <div className="nav-bar login_br">
          <Link to="/">
            <img className="nav_logo" src={logo3} alt="logo" />
          </Link>
          <span className="lingo">Lingo</span>
          <span className="pedia">Pedia</span>
        </div>
        <div className="login__image resize">
          <img src={login} alt="login" />
        </div>
        <div className="login__image-text">
          <p>
            "Begin a rich journey through diverse <br /> languages and explore
            the world."
          </p>
        </div>
      </div>
      <div className="login__form">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "5rem",
          }}
        >
          <div className="login__form-title">
            <h2>Welcome User</h2>
            <img src={logo} alt="logo" />
          </div>
          <div className="login__form-details">
            <form>
              <div
                className={`login__form-input ${
                  isNameFocused ? "focused" : ""
                }`}
              >
                <img src={user} alt="email" />
                <input
                  onChange={(e) => handleInputChange(e, setIsNameFocused)}
                  type="text"
                  id="Name"
                  onFocus={handleNameFocus}
                />
                <label>Name</label>
              </div>
              <div
                className={`login__form-input ${
                  isEmailFocused ? "focused" : ""
                }`}
              >
                <img src={email} alt="email" />
                <input
                  type="email"
                  onFocus={handleEmailFocus}
                  onChange={(e) => handleInputChange(e, setIsEmailFocused)}
                />
                <label>E-mail</label>
              </div>

              <div
                className={`login__form-input ${
                  isPasswordFocused ? "focused" : ""
                }`}
              >
                <img src={key} alt="key" />
                <input
                  type="password"
                  id="password"
                  onFocus={handlePasswordFocus}
                  onChange={(e) => handleInputChange(e, setIsPasswordFocused)}
                />
                <label className={isPasswordFocused ? "focused" : ""}>
                  Password
                </label>
                <img
                  className="eye"
                  src={eye}
                  alt="eye"
                  id="eyeIcon"
                  onClick={togglePasswordVisibility}
                />
              </div>

              <Link to="/language">
                <button className="login__form-button">
                  <span class="text ">Explore</span>
                </button>
              </Link>
            </form>
            <Link to="/login" className="login_change">
              ------- <span>Already an Account</span> -------
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
