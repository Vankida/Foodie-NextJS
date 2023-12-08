"use client";
import React from "react";
import styles from "./cartCard.module.css";

function CartCard({ dishID, link, header, details }) {
  return (
    <div className={styles.card} href={`/${dishID}`}>
      <img src={link} alt={"food"} className={styles.image} />
      <h2>{header}</h2>
      <p>{details}</p>
    </div>
  );
}

export default CartCard;
