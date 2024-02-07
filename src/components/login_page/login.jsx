import React, { useState } from "react";
import logo3 from "../../Assets/Welcome page/logo4.svg";
import login from "../../Assets/Welcome page/login.png";
import logo from "../../Assets/Welcome page/thinking.svg";
import email from "../../Assets/Welcome page/material-symbols_mail-outline.png";
import key from "../../Assets/Welcome page/carbon_password.png";
import eye from "../../Assets/Welcome page/el_eye-close (1).png";
import eye_open from "../../Assets/Welcome page/eye-open2.svg";
import "./login.css";
import { Link } from "react-router-dom";

export const Login = () => {
  function togglePasswordVisibility() {
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
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };
  const handleInputChange = (event, setState) => {
    const inputValue = event.target.value;
    setState(inputValue.length > 0);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
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
        <div className="login__image">
          <img src={login} alt="login" />
        </div>
        <div className="login__image-text">
          <p>
            "Dive right into the rich tapestry of languages and <br />
            continue your learning adventure."
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
            <h2>Welcome Back</h2>
            <img src={logo} alt="logo" />
          </div>
          <div className="login__form-details">
            <form>
              <div
                className={`login__form-input ${
                  isEmailFocused ? "focused" : ""
                }`}
              >
                <img src={email} alt="email" />
                <input type="email" onFocus={handleEmailFocus} />
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
                  onChange={(e) => handleInputChange(e, setIsEmailFocused)}
                />
                <label>Password</label>
                <img
                  className="eye"
                  src={eye}
                  alt="eye"
                  id="eyeIcon"
                  onClick={togglePasswordVisibility}
                  onChange={(e) => handleInputChange(e, setIsPasswordFocused)}
                />
              </div>

              <Link to="/course">
                <button className="login__form-button">
                  <span class="text ">Continue</span>
                </button>
              </Link>
            </form>
            <Link to="/register" className="login_change">
              ------- <span>Need an Account ?</span> -------
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
