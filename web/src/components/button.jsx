import styles from './button.module.css';

import React from "react";

export default function Button({ children, onClick, className }) {
  return (
    <div onClick={onClick} className={styles["button"] + (className ? " " + className : "")}>
      {children}
    </div>
  );
}
