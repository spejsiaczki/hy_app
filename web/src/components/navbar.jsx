import styles from "./navbar.module.css";
import logo from "../media/logo.png";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./button";
import { definition } from "@fortawesome/free-brands-svg-icons/faAdversal";

export default function Navbar() {
  const nav = useNavigate();

  return (
    <div className={styles["navbar"]}>
      <img
        className={styles["logo"]}
        src={logo}
        onClick={() => nav("/")}
        draggable="false"
      />
      <div className={styles["nav-links"]}>
        {/* <Button className={styles["button"]} onClick={() => nav("/about")}>O Nas</Button> */}
        <Button
          className={styles["button"]}
          onClick={() => (window.location.href = "https://hackyeah.pl")}
        >
          HackYeah
        </Button>
      </div>
    </div>
  );
}
