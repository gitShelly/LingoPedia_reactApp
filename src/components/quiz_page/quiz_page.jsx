import React, { useState, useEffect, useContext } from "react";
import "./quiz_page.css";
import "./quiz_progress.css";
import { Navbar } from "../nav_bar/nav2";
import { QuizData } from "./quizz-Q-A/QuizData.js";
import Circle from "./circle";
import { Result } from "./result";
import LangContext from "../../langProvider.js";

export const Quizpage = () => {
  const { langid } = useContext(LangContext);
  const [currentLang] = useState(langid);
  const [currentstate, setcurrentstate] = useState(0);
  const [buttonText, setButtonText] = useState("Next");
  const [score, setScore] = useState(0);
  const [clicked, setclickedOption] = useState(null); 
  const [circle] = useState(7);

  const arr = [];
  for (let i = 0; i < circle; i++) {
    const isActive = i <= currentstate;
    arr.push(
      <Circle className={`circle ${isActive ? "active" : ""}`} key={i}>
        {i + 1}
      </Circle>
    );
  }

  const progressbarChange = () => {
    if (currentstate >= circle) {
      setcurrentstate(circle);
    } else {
      setcurrentstate(currentstate + 1);
    }
  };

  const BackprogressbarChange = () => {
    if (currentstate <= 0) {
      setcurrentstate(0);
    } else {
      setcurrentstate(currentstate - 1);
    }
  };

  const [width, setwidth] = useState(0);
  useEffect(() => {
    setwidth((100 / (circle - 1)) * currentstate);
  }, [circle, currentstate]);

  const HandleChnage = () => {
    if (clicked !== null) {
      updateScore();
      progressbarChange();
    }

    if (currentstate < QuizData[currentLang].lang.length - 2) {
      setcurrentstate(currentstate + 1);
      setclickedOption(null); 
    } else if (currentstate < QuizData[currentLang].lang.length - 1) {
      setButtonText("Results");
      setclickedOption(null);
    }
  };

  const BackHandleChnage = () => {
    BackprogressbarChange();
    if (currentstate > 0) {
      setcurrentstate(currentstate - 1);
      if (clicked !== null) {
        updateScore(); 
      }
      setclickedOption(null); 
    }
    if (currentstate === 1) {
      setButtonText("Next");
    }
  };

  const updateScore = () => {
    if (clicked === QuizData[currentLang].lang[currentstate].answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const resetAll = () => {
    setcurrentstate(0);
    setclickedOption(null);
    setScore(0);
    setButtonText("Next");
  };

  if (currentstate === 7) {
    return <Result resl={score} tryAgain={resetAll} />;
  } else {
    return (
      <div className="container">
        <Navbar />
        <div className="main_container">
          <div className="q_heading">
            “Explore. <span id="q_confirm">Confirm</span> .Master”
          </div>
          <div className="progress_content">
            <div className="progress_main">
              <div className="progress" style={{ width: width + "%" }}></div>
              {arr}
            </div>
          </div>
          <div className="question_box">
            {QuizData[currentLang].lang[currentstate].question}
          </div>
          <div className="option-container">
            {QuizData[currentLang].lang[currentstate].options.map(
              (option, i) => {
                return (
                  <button
                    className={`option-btn btn_options ${
                      clicked === i + 1 ? "checked" : ""
                    }`}
                    key={i}
                    onClick={() => {
                      setclickedOption(i + 1);
                    }}
                  >
                    {option}
                  </button>
                );
              }
            )}
          </div>
          <div className="movement_btn">
            <button
              className="animated-button"
              onClick={BackHandleChnage}
              disabled={currentstate > 0 ? false : true}
            >
              <span>Back</span>
              <span></span>
            </button>
            <button
              className="animated-button"
              onClick={HandleChnage}
              disabled={clicked === null}
            >
              <span>{buttonText}</span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    );
  }
};

