"use client";
import React from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.mainLinks}>
        <div className={styles.logo}>Foodie</div>
        {/* <Link href="/" className={styles.link}>
          Menu
        </Link> */}
        {/* <Link href="/" className={styles.link}>
          Orders
        </Link> */}
      </div>
      <div className={styles.mainLinks}>
        <AuthLinks />
      </div>
    </div>
  );
};

export default Navbar;
