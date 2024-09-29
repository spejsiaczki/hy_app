import React, { useRef, useState } from "react";
import styles from "./upload.module.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/button";
import ProgressBar from "../components/progress-bar";
import { setReportVideo } from "./report";
import { useNavigate } from "react-router-dom";

export default function Upload() {
    const nav = useNavigate();
    const fileInputRef = useRef(null);
    const dropzoneRef = useRef(null);
    const [buttonActive, setButtonActive] = useState(true);
    const [isUploading, setIsUploading] = useState(false); // Track if upload is in progress
    const progressBarRef = useRef(null);

    // const [job_id, setJobId] = useState(null);

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
                const percentComplete = Math.round(
                    (event.loaded / event.total) * 100
                );
                // setProgress(percentComplete);
                progressBarRef.current?.setProgress(percentComplete);
                console.log(`Upload progress: ${percentComplete}%`);
            }
        };

        xhr.onloadend = () => {
            setIsUploading(false); // Mark the upload as finished
            if (xhr.status === 200) {
                console.log("File uploaded successfully");
                const response = JSON.parse(xhr.responseText);
                sentJobRequest(response.job_id);
                nav("/report", { replace: true });
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
                <div className={styles["drop-tip"]}>
                    Upuść tutaj materiały wideo...
                </div>
                <FontAwesomeIcon
                    className={styles["upload-icon"]}
                    icon={faUpload}
                />
                <Button
                    className={
                        styles["upload-button"] +
                        (!buttonActive
                            ? ` ${styles["upload-button-disabled"]}`
                            : "")
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

            {isUploading && <ProgressBar ref={progressBarRef} />}
        </div>
    );
}
