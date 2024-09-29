import styles from "./report.module.css";
import { useEffect, useCallback } from "react";
import React from "react";
import Plot from "react-plotly.js";

let reportVideo = null;
let reportData = null;

function setReportVideo(video) {
  reportVideo = video;
  window.dispatchEvent(new Event("setReportVideo"));
}

function setReportData(data) {
  reportData = data;
  window.dispatchEvent(new Event("setReportData"));
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
  const [_, setRerenderCount] = React.useState(0);

  const rerender = useCallback(() => {
    setRerenderCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const setReportVideoListener = () => {
      rerender();
    };

    const setReportDataListener = () => {
      rerender();
    };

    window.addEventListener("setReportVideo", setReportVideoListener);
    window.addEventListener("setReportData", setReportDataListener);
    return () => {
      window.removeEventListener("setReportVideo", setReportVideoListener);
      window.removeEventListener("setReportData", setReportDataListener);
    };
  }, []);

  if (!reportData) {
    return <div>Waiting for data...</div>;
  }

  // Compute number of words in each second to create a kind of bucket plot
  const wordsPerSecond = {};
  let currentSecond = 1;
  for (let i = 0; i < reportData.word_timestamps.length; i++) {
    const word = reportData.word_timestamps[i];
    if (word.start < currentSecond) {
      if (wordsPerSecond[currentSecond] === undefined) {
        wordsPerSecond[currentSecond] = 1;
      } else {
        wordsPerSecond[currentSecond]++;
      }
    }
    else {
      currentSecond++;
      i--;
    }
  }
  const wordsPerSecondX = Object.keys(wordsPerSecond);
  const wordsPerSecondY = Object.values(wordsPerSecond);

  return (
    <div className={styles["report"]}>
      <div className={styles["video-pane"]}>
        <div className={styles["slogan"]}>Wyniki analizy</div>
        <video controls className={styles["video"]}>
          {reportVideo && (
            <source
              src={URL.createObjectURL(reportVideo)}
              type="video/mp4"
            />
          )}
          {/* <source
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          /> */}
          Your browser does not support the video tag.
        </video>
      </div>
      <div className={styles["results-pane"]}>
        <div className={styles["result-title"]}>Transkrypcja</div>
        <div className={styles["transcript-pane"]}>
          {reportData.sp.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        <div className={styles["result-title"]}>Podsumowanie</div>
        <div className={styles["result-cards"]}>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>{reportData.sp.split(" ").length}</div>
            <div className={styles["result-value"]}>Liczba słów</div>
          </div>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>{parseFloat(reportData.gunning_fog.score).toFixed(2)}</div>
            <div className={styles["result-value"]}>Współczynnik Mglistości Gunninga</div>
          </div>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>{reportData.comparison.description.replace(/'/g, "")}</div>
            <div className={styles["result-value"]}>Poprawność Napisów</div>
          </div>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>{reportData.background_person_detection.length}</div>
            <div className={styles["result-value"]}>Liczba sylwetek w tle</div>
          </div>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>{reportData.head_movement.head_movement[0]}</div>
            <div className={styles["result-value"]}>Częstość ruchów głowy</div>
          </div>
        </div>
        <div className={styles["result-title"]}>Analiza Audio</div>
        <div className={styles["result-cards"]}>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>{reportData.audio_analysis.loud_moments.length}</div>
            <div className={styles["result-value"]}>Głośne momenty</div>
          </div>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>{reportData.audio_analysis.long_silence.length}</div>
            <div className={styles["result-value"]}>Długie cisze</div>
          </div>
          <div className={styles["result"]}>
            <div className={styles["result-label"]}>{reportData.audio_analysis.repeating_sound.length}</div>
            <div className={styles["result-value"]}>Powtarzające się dźwięki</div>
          </div>
        </div>
        <div className={styles["result-title"]}>Wykryte emocje</div>
        <div className={styles["result-cards"]}>
          <ul>
            {Object.entries(reportData.emotions_detection.emotions_detection.emotions).map(([stamp, emotion]) => (
              <li key={emotion}>{stamp}: {emotion}</li>
            ))}
          </ul>
        </div>

        <div className={styles["result-title"]}>Statystyki Czasowe</div>
        <div className={styles["plot-container"]}>
          <StyledPlot
            className={styles["plot"]}
            title="Słowa na Sekundę"
            data={[
              {
                x: wordsPerSecondX,
                y: wordsPerSecondY,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "#e6a" },
              },
            ]}
          />
          {/* <StyledPlot
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
          /> */}
        </div>
      </div>
    </div >
  );
}

export { setReportVideo, setReportData };
