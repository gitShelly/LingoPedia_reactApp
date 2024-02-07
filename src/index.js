import React from "react";
import ReactDOM from "react-dom";
import {App} from "./components/App.jsx";
import { LangProvider } from './langProvider';


ReactDOM.render(<React.StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </React.StrictMode>, document.getElementById("root"));

