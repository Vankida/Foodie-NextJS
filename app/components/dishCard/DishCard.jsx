"use client";
import React from "react";
import styles from "./dishCard.module.css";
import Link from "next/link";

function DishCard({ dishID, link, header, details }) {
  return (
    <Link className={styles.card} href={`/${dishID}`}>
      <img src={link} alt={"food"} className={styles.image} />
      <h2>
        {header} <span>-&gt;</span>
      </h2>
      <p>{details}</p>
    </Link>
  );
}

export default DishCard;
