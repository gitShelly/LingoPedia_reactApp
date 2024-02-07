import React ,{ useContext }from 'react';
import { Navbar } from '../nav_bar/nav2';
import { UploadNotes } from './UploadVideo';
import './dashboard.css';
import { videodata } from './videos.js';
import LangContext from '../../langProvider.js';


export const Dashboard = () => {
  const {langid} = useContext(LangContext);
  
  const openVideoInNewTab = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className="mainnnn">
      <Navbar />
      <div className="courses_maincontainer">
        <div className="courses_beginner  ">
          <p className="course_heading">
            Beginner Level<span id="arrow">>>></span>
          </p>
          <div className="beginner_videos">
            {videodata[langid].lang[0].beginner.map((link, i) => {
              return (
                <iframe
                  key={i}
                  onClick={() => openVideoInNewTab(link)}
                  className="courses_iframe"
                  src={link}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              );
            })}
          </div>
        </div>
        <div className="courses_beginner">
          <p className="course_heading">
            Advance Level<span id="arrow">>>></span>
          </p>
          <div className="beginner_videos">
            {videodata[langid].lang[0].advance.map((link, i) => {
              return (
                <iframe
                  key={i}
                  onClick={() => openVideoInNewTab(link)}
                  className="courses_iframe"
                  src={link}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              );
            })}
          </div>
        </div>
        <div className="courses_beginner">
          <p className="course_heading">
            Study Notes<span id="arrow">>>></span>
          </p>
          <UploadNotes />
        </div>
      </div>
    </div>
  );
};
