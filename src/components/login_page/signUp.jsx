import React, { useState } from "react";
import logo3 from "../../Assets/Welcome page/logo4.svg";
import login from "../../Assets/Welcome page/signup.png";
import logo from "../../Assets/Welcome page/thinking.svg";
import email2 from "../../Assets/Welcome page/material-symbols_mail-outline.png";
import key from "../../Assets/Welcome page/carbon_password.png";
import eye from "../../Assets/Welcome page/el_eye-close (1).png";
import eye_open from "../../Assets/Welcome page/eye-open2.svg";
import user from "../../Assets/Welcome page/user.png";
import "./login.css";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [messages, setMessages] = useState({
    name: "",
    email: "",
    password: "",
  });

  const checkValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domainRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return false;
    }

    const [, domain] = email.split("@");
    if (!domainRegex.test(email)) {
      return false;
    }
    return true;
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
    const { valid: isPasswordValid, message: passwordMessage } =
      validPassword(password);

    setMessages({
      name: name ? "" : "Please enter your name.",
      email: isValidEmail ? "" : "Please enter a valid email address.",
      password: isPasswordValid ? "" : passwordMessage,
    });

    if (isValidEmail && isPasswordValid && name) {
      try {
        await axios.post("/register", {
          name,
          email,
          password,
        });
        alert("You are now a registered user.");
        setRedirect(true);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setMessages({
            ...messages,
            email: "The email is already in use.",
          });
        } else {
          setMessages({
            ...messages,
            email: "Registration failed.",
          });
        }
      }
    }
  };

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
          }}
        >
          <div className="login__form-title">
            <h2>Welcome User</h2>
            <img src={logo} alt="logo" />
          </div>
          <div className="login__form-details">
            <form onSubmit={registerUser}>
              <div
                className={`login__form-input ${
                  isNameFocused ? "focused" : ""
                }`}
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
              <div className="error">{messages.name}</div>
              <div
                className={`login__form-input ${
                  isEmailFocused ? "focused" : ""
                }`}
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
              <div className="error">{messages.email}</div>

              <div
                className={`login__form-input ${
                  isPasswordFocused ? "focused" : ""
                }`}
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
              <div className="error">{messages.password}</div>
              <span className="pass_format">Password format</span>

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
