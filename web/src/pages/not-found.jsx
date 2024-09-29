import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles["not-found"]}>
      <div className={styles["centering"]}>
        <div className={styles["code-backdrop"]}>404</div>
        <div className={styles["header"]}>Ups!</div>
        <div className={styles["subtitle"]}>Ta strona nie istnieje!</div>
      </div>
    </div>
  );
}
