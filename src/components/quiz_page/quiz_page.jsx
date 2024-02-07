import React, { useState, useEffect, useContext } from "react";
import "./quiz_page.css";
import "./quiz_progress.css";
import {Navbar} from "../nav_bar/nav2"
import { QuizData } from "./quizz-Q-A/QuizData.js";
import Circle from "./circle";
import {Result} from "./result"
import LangContext from '../../langProvider.js';



export const Quizpage = () => {

  const {langid} = useContext(LangContext);
  const [currentLang]=useState(langid);
  const [currentstate, setcurrentstate] = useState(0);
  const [buttonText, setButtonText] = useState("Next");
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
  
  const HandleChnage = () => {
    updateScore();
    progressbarChange();

    if (currentstate < QuizData[currentLang].lang.length - 2) {
      setcurrentstate(currentstate + 1);
      setclickedOption(0)
    } else if (currentstate < QuizData[currentLang].lang.length - 1) {
      setButtonText("Results");
      setclickedOption(0)    
    }
  };
  
  const BackprogressbarChange = () => {
    if (currentstate <= 0) {
      setcurrentstate(0);
    } else {
      setcurrentstate(currentstate - 1);
    }
  };

  const BackHandleChnage = () => {
    BackprogressbarChange();
    if(score<0){
      setScore(0)
    }
    if (currentstate < QuizData[currentLang].lang.length - 2) {
      setcurrentstate(currentstate - 1);
      setScore(score-1)
      setclickedOption(0)
    } else if (currentstate < QuizData[currentLang].lang.length) {
      setButtonText("Next");
      setScore(score-1)
      setclickedOption(0)
    }
  };

  const [width, setwidth] = useState(0);
  useEffect(() => {
    setwidth((100 / (circle - 1)) * currentstate);
  }, [circle, currentstate]);

  const [score, setScore] = useState(0);
  const [clicked, setclickedOption] = useState(0);

  const updateScore = () => {
    if (clicked === QuizData[currentLang].lang[currentstate].answer) {
      setScore(score + 1);
    }
  };
  const resetAll=()=>{
    setcurrentstate(0);
    setclickedOption(0);
    setScore(0);
    setButtonText("Next");
  }

  if (currentstate === 7) {
    return (
      <Result resl={score} tryAgain={resetAll}/>
    );
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
            {QuizData[currentLang].lang[currentstate].options.map((option, i) => {
              return (
                <button
                  className={`option-btn btn_options ${
                    clicked === i + 1 ? "checked" : null
                  }`}
                  key={i}
                  onClick={() => {
                    setclickedOption(i + 1);
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <div className="movement_btn">
            <button
              className="animated-button"
              onClick={BackHandleChnage}
              disabled={currentstate > 0 ? false : true}>
              <span>Back</span>
              <span></span>
            </button>
            <button className="animated-button" onClick={HandleChnage}>
              <span>{buttonText}</span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    );
  }
};
