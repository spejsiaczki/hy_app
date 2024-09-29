import styles from './progress-bar.module.css';

import React from "react";

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: props.progress || 0,
      status: "Ładowanie..."
    };
  }

  setProgress(progress) {
    this.setState({ progress });
  }

  setStatus(status) {
    this.setState({ status });
  }

  render() {
    return (
      <div className={styles["progress-bar"]}>
        <div className={styles["progress-backdrop"]}/>
        <div id="progress-mask" className={styles["progress"]} style={{ width: this.state.progress + "%" }}/>
        <div className={styles["status"]}>{this.state.status}</div>
      </div>
    );
  }
}

export default ProgressBar;
