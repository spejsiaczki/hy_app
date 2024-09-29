import styles from "./report.module.css";
import { useEffect } from "react";
import React from "react";
import Plot from "react-plotly.js";

let reportVideo = null;
let job_id = null;
let intervalId = null;

function setReportVideo(video) {
  reportVideo = video;
  window.dispatchEvent(new Event("setReportVideo"));
}

function setJobId(id) {
  job_id = id;
  window.dispatchEvent(new Event("setJobId"));
}

function setIntervalId(id) {
  intervalId = id;
}

function StyledPlot({ className, title, data }) {
  return (
    <Plot
      className={className}
      data={data}
      layout={{
        width: 320,
        height: 240,
        title: title,
        margin: { t: 40, r: 20, b: 20, l: 20 },
        plot_bgcolor: "#0000",
        paper_bgcolor: "#0000",
        font: { color: "#eee" },
      }}
      config={{
        // displayModeBar: false,
        // responsive: true,
        // displaylogo: false,
        staticPlot: true,
      }}
    />
  );
}

export default function Report() {
  // const [intervalId, setIntervalId] = React.useState(null);

  const handleData = (data) => {
    console.log("Data received: ", data);
    clearInterval(intervalId);
  };

  const sendJobRequest = (job_id) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/get_job/" + job_id, true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log("Job data received successfully");
        handleData(response);
      } else {
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

  useEffect(() => {
    const listener = () => {
      console.log("reportVideo:", reportVideo);
    };
      
    const intervalId = setInterval(() => {
        sendJobRequest(job_id);
    }, 1000);
    setIntervalId(intervalId);
    
    window.addEventListener("setReportVideo", listener);
    window.addEventListener("setJobId", listener);
    return () => {
      window.removeEventListener("setReportVideo", listener);
      window.removeEventListener("setJobId", listener);
    };
  }, []);

  let transcript =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  let audio_errors = 0;

  return (
    <div className={styles["report"]}>
      <div className={styles["video-pane"]}>
        <div className={styles["slogan"]}>Wyniki analizy</div>
        <video controls className={styles["video"]}>
          <source
                        src={URL.createObjectURL(reportVideo)}
                        type="video/mp4"
                    />
          {/* <source
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          /> */}
          Your browser does not support the video tag.
        </video>
        <div className={styles["transcript"]}> Transkrypcja </div>
        <div className={styles["transcript-pane"]}>
          {transcript.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
      <div className={styles["results-pane"]}>
        <div className={styles["result-title"]}>Podsumowanie</div>
        <div className={styles["result-cards"]}>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>100</div>
            <div className={styles["result-value"]}>Liczba słów</div>
          </div>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>100</div>
            <div className={styles["result-value"]}>Liczba słów</div>
          </div>
        </div>
        <div className={styles["result-title"]}>Wykryte błędy</div>
        <div className={styles["result-cards"]}>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>Dźwiękowe</div>
            <div
              className={
                styles["result-value"] + " " + (audio_errors == 0)
                  ? styles["great"]
                  : audio_errors < 3
                    ? styles["ok"]
                    : styles["bad"]
              }
            >
              Przerywniki: {audio_errors}
            </div>
          </div>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>Treść</div>
            <div className={styles["result-value"]}>Liczba słów</div>
          </div>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>Wizualne</div>
            <div className={styles["result-value"]}>Liczba słów</div>
          </div>
        </div>
        <div className={styles["plot-container"]}>
          <StyledPlot
            className={styles["plot"]}
            title="Jakość Przekazu"
            data={[
              {
                x: [1, 2, 3, 7],
                y: [2, 6, 3, 1],
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "#e6a" },
              },
            ]}
          />
          <StyledPlot
            className={styles["plot"]}
            title="Jakość Przekazu"
            data={[
              {
                x: [1, 2, 3],
                y: [2, 6, 3],
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "#8e6" },
              },
            ]}
          />
          <StyledPlot
            className={styles["plot"]}
            title="Jakość Przekazu"
            data={[
              {
                x: [1, 2, 3, 4],
                y: [2, 1, 3, 3],
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "#e86" },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export { setReportVideo, setJobId };
