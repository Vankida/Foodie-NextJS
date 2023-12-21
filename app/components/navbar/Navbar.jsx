"use client";
import React from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div
        style={{
          display: "flex",
          textAlign: "bottom",
          alignContent: "bottom",
          alignItems: "bottom",
          gap: "20px",
        }}
      >
        <Link href="/" className={styles.link}>
          <div className={styles.logo}>Foodie</div>
        </Link>
        <div className={styles.mainLinks}>
          <Link href="/" className={styles.link}>
            Menu
          </Link>
          <Link href="/order" className={styles.link}>
            Orders
          </Link>
        </div>
      </div>

      <div className={styles.mainLinks}>
        {/* <div className={styles.authLinks}> */}
        <AuthLinks />
      </div>
    </div>
  );
};

export default Navbar;
