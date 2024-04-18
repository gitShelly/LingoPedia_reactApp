import React, { useState, useRef, useContext ,useEffect} from "react";
import { Navbar } from "../nav_bar/nav2";
import upload from "../../Assets/upload page/upload.png";
import uploadicon from "../../Assets/upload page/upload icon 2.png";
import contribute from "../../Assets/upload page/contribute.png";
import "./upload.css";
import { Link } from "react-router-dom";
import LangContext from "../../langProvider.js";
import  axios  from "axios";
import {UserContext} from '../usercontext.jsx';
export const Upload = () => {
  const [files, setFiles] = useState(null);
  const inputRef = useRef();
  const {langid} = useContext(LangContext);
  const [ispublic,setIsPublic]=useState(false);
  const {user}=useContext(UserContext);

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", user._id); // Assuming userId is available in scope
      formData.append("lang", langid); // Assuming lang is available in scope
      formData.append("pdf", files[0]); // Assuming files[0] contains the uploaded file
      formData.append("isPublic", ispublic);

      const response = await axios.post("/submit-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("File uploaded successfully");
        setFiles(null);
      } else {
        alert("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert("Failed to upload file");
    }
  };

  // useEffect(() => {
  //   if (files && files.length > 0) {
  //     setPdfAndUpdate(files);
  //     setUploadedFileAndUpdate(files[0]);
  //   }
  // }, [files, setPdfAndUpdate, setUploadedFileAndUpdate]);

  const handleDragOver = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
    setFiles(null);
  };

 

  if (files) {
    return (
      <div>
        <Navbar />
        <div className="mainn_container">
          <div className="upload_container">
            <div className="uploads">
              <img src={contribute} alt="contibute" />
              <div className="contri_content">
                <p className="selected_file" data-text="Your Selected File">
                  Your Selected File
                </p>
                <ul className="file_name">
                  {Array.from(files).map((file, idx) => (
                    <>
                    <li key={idx}>{file.name}</li>
                    <embed className="changeEmbed" src={URL.createObjectURL(file)} width="100%" height="100%" type="application/pdf"/></>
                  ))}
                </ul>
                <div className="priv_pub">
                  <div className="pub">
                  <input type="radio" onChange={()=>setIsPublic(true)} name="option"/> Public
                  </div>
                  <div className="priv">
                  <input type="radio"  onChange={()=>setIsPublic(false)} checked={!ispublic} name="option"/> Private
                  </div>
                </div>
                <div className="btn_actions">
                  <button className="button8 type2" onClick={() => setFiles(null)}></button>
                  <Link to="/course">
                    <button className="button8 type1" onClick={handleUpload} ></button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mainn_container">
        <div className="upload_container">
          <img src={upload} alt="upload" className="upload_image" />
          <div className="dropzone" onDragOver={handleDragOver} onDrop={handleDrop}>
            <img src={uploadicon} alt="uploadIcon" className="upload_icon" />
            <div className="upload_text">
              <p className="drag_drop">Drag & Drop Files</p>
              <p onClick={() => inputRef.current.click()} className="browse">
                Your files here or Browse to upload
              </p>
              <input type="file" multiple onChange={(event) => setFiles(event.target.files)} hidden accept="image/png, image/jpeg ,application/pdf , application/msword" ref={inputRef}/>
              <p className="upload_type">
                Only Jpeg/Png/Pdf/Doc files with max size of 150MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};