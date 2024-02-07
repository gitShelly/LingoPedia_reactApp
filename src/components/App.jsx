import React from 'react';

import{
  BrowserRouter as Router,
  Routes,
  Route,

} from "react-router-dom"

import "./App.css";
import {Home} from "./home_page/home"
import {Language} from './dashboard_WantToLearn/language';
import {Dashboard} from './dashboard_WantToLearn/dashboard';
import {Quizpage} from './quiz_page/quiz_page';
import {Upload} from './upload_page/upload';
import {Register} from "./login_page/signUp"
import {Login} from "./login_page/login"
import { LangProvider } from '../langProvider.js';



export const App = () => {
  return (
    <Router>
    <LangProvider> 
      <div className="main">
      </div>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/language" element={<Language />} />
        <Route exact path="/course" element={<Dashboard />} />
        <Route exact path="/test" element={<Quizpage />} />
        <Route exact path="/upload" element={<Upload />} />
      </Routes>
    </LangProvider>
  </Router>
);
}
