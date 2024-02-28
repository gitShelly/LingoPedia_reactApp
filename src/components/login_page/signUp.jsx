import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import logo3 from "../../Assets/Welcome page/logo4.svg";
import login from "../../Assets/Welcome page/signup.png";
import logo from "../../Assets/Welcome page/thinking.svg";
import email2 from "../../Assets/Welcome page/material-symbols_mail-outline.png";
import key from "../../Assets/Welcome page/carbon_password.png";
import eye from "../../Assets/Welcome page/el_eye-close (1).png";
import eye_open from "../../Assets/Welcome page/eye-open2.svg";
import user from "../../Assets/Welcome page/user.png";
import "./login.css";

export const Register = () => {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const checkValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domainRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email) && domainRegex.test(email);
  };

  const validPassword = (password) => {
    let valid = true;
    let message = "";

    if (password.length < 8) {
      message = "Passwords must be at least 8 characters.";
      valid = false;
    } else if (password.length > 15) {
      message = "Passwords cannot be more than 15 characters.";
      valid = false;
    } else if (!/\d/.test(password)) {
      message = "Passwords must contain at least one number.";
      valid = false;
    } else if (!/[a-z]/.test(password)) {
      message = "Passwords must contain at least one lowercase letter.";
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      message = "Passwords must contain at least one uppercase letter.";
      valid = false;
    } else if (!/[!@#$%&*()-+=^]/.test(password)) {
      message =
        "Passwords must contain at least one special character (!@#$%&*()-+=^).";
      valid = false;
    } else if (/\s/.test(password)) {
      message = "Passwords cannot contain whitespace.";
      valid = false;
    }

    return { valid, message };
  };

  const registerUser = async (ev) => {
    ev.preventDefault();

    const isValidEmail = checkValidEmail(email);
    const { valid: isPasswordValid, message: passwordMessage } = validPassword(password);

    let errorMessage = "";

    if (!name) {
      errorMessage += "Please enter your name. ";
      
    }

    if (!isValidEmail) {
      errorMessage += "Please enter a valid email. ";
    }

    if (!isPasswordValid) {
      errorMessage += passwordMessage + " ";
    }

    if (password !== confirmPassword) {
      errorMessage += "Passwords don't match. ";
    }

    if (errorMessage) {
      setErrorMessage(errorMessage.trim());
      return;
    }

    try {
      await axios.post("/register", {
        name,
        email,
        password,
      });
      // alert("You are now a registered user.");
      setRedirect(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message); // Set custom error message from server
      } else {
        setErrorMessage("Registration failed.");
      }
    }
  };

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

  const togglePasswordVisibility = () => {
    setIsPasswordFocused(true);
    const passwordInput = document.getElementById("password");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordFocused(true);
    const confirmPasswordInput = document.getElementById("confirmPassword");

    if (confirmPasswordInput.type === "password") {
      confirmPasswordInput.type = "text";
    } else {
      confirmPasswordInput.type = "password";
    }
  };

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

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
            width: "100%",
          }}
        >
          <div className="login__form-title">
            <h2>Welcome User</h2>
            <img src={logo} alt="logo" />
          </div>
          <div className="login__form-details">
            <form onSubmit={registerUser}>
              <div
                className={`login__form-input ${isNameFocused ? "focused" : ""}`}
              >
                <img src={user} alt="email" />
                <input
                  onChange={(e) => {
                    handleInputChange(e, setIsNameFocused);
                    setName(e.target.value);
                  }}
                  value={name}
                  type="text"
                  id="Name"
                  onFocus={handleNameFocus}
                />
                <label>Name</label>
              </div>
              {/* <div className="error">{errorMessage}</div> */}
              <div
                className={`login__form-input ${isEmailFocused ? "focused" : ""}`}
              >
                <img src={email2} alt="email" />
                <input
                  value={email}
                  type="email"
                  onFocus={handleEmailFocus}
                  onChange={(e) => {
                    handleInputChange(e, setIsEmailFocused);
                    setEmail(e.target.value);
                  }}
                />
                <label>E-mail</label>
              </div>
              {/* <div className="error">{errorMessage}</div> */}
              <div
                className={`login__form-input ${isPasswordFocused ? "focused" : ""}`}
              >
                <img src={key} alt="key" />
                <input
                  value={password}
                  type="password"
                  id="password"
                  onFocus={handlePasswordFocus}
                  onChange={(e) => {
                    handleInputChange(e, setIsPasswordFocused);
                    setPassword(e.target.value);
                  }}
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
              {/* <div className="error">{errorMessage}</div> */}
              <div
                className={`login__form-input ${
                  isConfirmPasswordFocused ? "focused" : ""
                }`}
              >
                <img src={key} alt="key" />
                <input
                  value={confirmPassword}
                  type="password"
                  id="confirmPassword"
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onChange={(e) => {
                    handleInputChange(e, setIsConfirmPasswordFocused);
                    setConfirmPassword(e.target.value);
                  }}
                />
                <label className={isConfirmPasswordFocused ? "focused" : ""}>
                  Confirm Password
                </label>
                <img
                  className="eye"
                  src={eye}
                  alt="eye"
                  id="confirmPasswordEyeIcon"
                  onClick={toggleConfirmPasswordVisibility}
                />
              </div>
              <div className="error">{errorMessage}</div>
              <button className="login__form-button" type="submit">
                <span class="text ">Register</span>
              </button>
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


