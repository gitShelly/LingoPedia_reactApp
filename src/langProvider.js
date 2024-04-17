import React, { createContext, useState, useEffect } from "react";

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const storedLangId = localStorage.getItem("langid");
  const [langid, setLangid] = useState(
    storedLangId ? parseInt(storedLangId, 10) : 0
  );

  const [pdf, setPdf] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const setUploadedFileAndUpdate = (file) => {
    setUploadedFile(file);
  };
  const setPdfAndUpdate = (url) => {
    setPdf(uploadedFile);
  };

  useEffect(() => {
    localStorage.setItem("langid", langid.toString());
  }, [langid]);

  const setLangIdAndUpdate = (id) => {
    setLangid(id);
  };

  return (
    <LangContext.Provider
      value={{
        langid,
        setLangIdAndUpdate,
        pdf,
        setPdfAndUpdate,
        uploadedFile,
        setUploadedFileAndUpdate,
      }}
    >
      {children}
    </LangContext.Provider>
  );
};

export default LangContext;
