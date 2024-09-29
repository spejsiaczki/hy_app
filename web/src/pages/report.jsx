import styles from './report.module.css';
import { useEffect } from 'react';

let reportVideo = null;

function setReportVideo(video) {
  reportVideo = video;
  window.dispatchEvent(new Event('setReportVideo'));
}

export default function Report() {
  useEffect(() => {
    const listener = () => {
      console.log('reportVideo:', reportVideo);
    }
    window.addEventListener('setReportVideo', listener);
    return () => {
      window.removeEventListener('setReportVideo', listener);
    }
  }, []);

  return (
    <div className={styles['report']}>
      <div className={styles['video-pane']}>
        <div className={styles['slogan']}>
          Wyniki analizy
        </div>
        <video controls className={styles['video']}>
          {/* <source src={URL.createObjectURL(reportVideo)} type="video/mp4" /> */}
          <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className={styles['results-pane']}>
        Lorem ipsum dolor sit amet<br />
        consectetur adipiscing elit<br />
        sed do eiusmod tempor incididunt<br />
        ut labore et dolore magna aliqua<br />

      </div>
    </div>
  );
}

export { setReportVideo };
