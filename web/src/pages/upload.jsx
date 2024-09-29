import React, { useRef, useState, useEffect } from "react";
import styles from "./upload.module.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/button";
import ProgressBar from "../components/progress-bar";
import { setReportVideo, setReportData } from "./report";
import { useNavigate } from "react-router-dom";

let intervalId = null;
let jobId = null;

function setIntervalId(id) {
    intervalId = id;
}

function setJobId(id) {
    jobId = id;
}

export default function Upload() {
    useEffect(() => {
        const interval = setInterval(() => {
            if (jobId) {
                jobStatusRequest(jobId);
            }
        }
            , 1000);
        setIntervalId(interval);
        return () => {
            clearInterval(interval);
        };
    }, []);
    
  const nav = useNavigate();
  const fileInputRef = useRef(null);
  const dropzoneRef = useRef(null);
  const [buttonActive, setButtonActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // Track if upload is in progress
    const progressBarRef = useRef(null);
    const [loading, setLoading] = useState(false);

  const handleData = (data) => {
    console.log("Data received: ", data);
      clearInterval(intervalId);
      setReportData(data);
      nav("/report", { replace: true });
  };

    const jobStatusRequest = (job_id) => {
      setLoading(true);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/get_job/" + job_id, true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log("Job data received successfully");
        handleData(response);
      } else if (xhr.status === 206) {
          console.log(xhr.responseText);
          const progress = JSON.parse(xhr.responseText).progress;
            console.log("Job is still in progress");
            const percentComplete = Math.round(25 + (progress * 75));
          progressBarRef.current?.setProgress(percentComplete);
          console.log(`Job progress: ${percentComplete}%`);
      }
        else {
        let err = xhr.statusText;
        if (xhr.status == 400) {
          const text = xhr.responseText;
          err = JSON.parse(text).error;
          alert("Nie udało się wysłać zapytania: " + err);
        }
      }
    };
    xhr.onerror = () => {
      console.error("An error occurred during the job request");
    };
    xhr.send(JSON.stringify({ job_id: job_id }));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const sentJobRequest = (job_id) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/run_job/" + job_id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log("Job request sent successfully");
        console.log(xhr.responseText);
        // window.location.href = "/results/" + job_id;
      } else {
        let err = xhr.statusText;
        if (xhr.status == 400) {
          const text = xhr.responseText;
          err = JSON.parse(text).error;
        }
        alert("Nie udało się wysłać zapytania: " + err);
      }
    };
    xhr.onerror = () => {
      console.error("An error occurred during the job request");
    };
    xhr.send(JSON.stringify({ job_id: job_id }));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFileUpload(files[0]); // Handle the dropped file
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    handleFileUpload(files[0]); // Handle the selected file
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    setReportVideo(file);

    const formData = new FormData();
    formData.append("file", file); // Append the file to FormData

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/video", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 25);
        progressBarRef.current?.setProgress(percentComplete);
        // setProgress(percentComplete);
        console.log(`Upload progress: ${percentComplete}%`);
      }
    };

    xhr.onloadend = () => {
      setIsUploading(false); // Mark the upload as finished
      if (xhr.status === 200) {
        console.log("File uploaded successfully");
        const response = JSON.parse(xhr.responseText);
        sentJobRequest(response.job_id);
        setJobId(response.job_id);
      } else {
        let err = xhr.statusText;
        if (xhr.status == 400) {
          const text = xhr.responseText;
          err = JSON.parse(text).error;
        }
        alert("Nie udało się wysłać pliku: " + err);
      }
    };

    xhr.onerror = () => {
      console.error("An error occurred during the file upload");
    };

    xhr.send(formData); // Initiate the upload
  };

  return (
    <div className={styles["upload"]}>
      <div className={styles["slogan"]}>
        Dokonaj analizy przemówienia w parę sekund!
          </div>
          {loading ? <><ProgressBar ref={progressBarRef} /> <br/><br/><div className={styles["loading"]}>Może to potrwać do 5 minut...</div></>:
              <div
                  className={styles["dropzone"]}
                  ref={dropzoneRef}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnter={() => {
                      dropzoneRef.current.classList.add(styles["drag-over"]);
                      setButtonActive(false);
                  }}
                  onDragLeave={() => {
                      dropzoneRef.current.classList.remove(styles["drag-over"]);
                      setButtonActive(true);
                  }}
                  onMouseUp={() => {
                      dropzoneRef.current.classList.remove(styles["drag-over"]);
                      setButtonActive(true);
                  }}
                  onMouseLeave={() => {
                      dropzoneRef.current.classList.remove(styles["drag-over"]);
                      setButtonActive(true);
                  }}
              >
                  <div className={styles["drop-tip"]}>Upuść tutaj materiały wideo...</div>
                  <FontAwesomeIcon className={styles["upload-icon"]} icon={faUpload} />
                  <Button
                      className={
                          styles["upload-button"] +
                          (!buttonActive ? ` ${styles["upload-button-disabled"]}` : "")
                      }
                      onClick={handleClick}
                  >
                      Wybierz z Dysku
                  </Button>
                  <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileSelect}
                  />
              </div>
          }
      {isUploading && <ProgressBar ref={progressBarRef} />}
    </div>
  );
}
