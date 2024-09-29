import styles from "./report.module.css";
import { useEffect } from "react";
import Plot from "react-plotly.js";

let reportVideo = null;

function setReportVideo(video) {
    reportVideo = video;
    window.dispatchEvent(new Event("setReportVideo"));
}

export default function Report() {
    useEffect(() => {
        const listener = () => {
            console.log("reportVideo:", reportVideo);
        };
        window.addEventListener("setReportVideo", listener);
        return () => {
            window.removeEventListener("setReportVideo", listener);
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
                    {/* <source
                        src={URL.createObjectURL(reportVideo)}
                        type="video/mp4"
                    /> */}
                    <source
                        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                        type="video/mp4"
                    />
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
                        <div className={styles["result-value"]}>
                            Liczba słów
                        </div>
                    </div>
                    <div className={styles["result"]}>
                        <div className={styles["result-label"]}>100</div>
                        <div className={styles["result-value"]}>
                            Liczba słów
                        </div>
                    </div>
                </div>
                <div className={styles["result-title"]}>Wykryte błędy</div>
                <div className={styles["result-cards"]}>
                    <div className={styles["result"]}>
                        <div className={styles["result-label"]}>Dźwiękowe</div>
                        <div
                            className={
                                styles["result-value"] +
                                " " +
                                (audio_errors == 0)
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
                        <div className={styles["result-value"]}>
                            Liczba słów
                        </div>
                    </div>
                    <div className={styles["result"]}>
                        <div className={styles["result-label"]}>Wizualne</div>
                        <div className={styles["result-value"]}>
                            Liczba słów
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { setReportVideo };
