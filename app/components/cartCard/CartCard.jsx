"use client";
import React, { useEffect, useState } from "react";
import styles from "./cartCard.module.css";

function CartCard({ dishName, dishPrice, totalPrice, dishImage }) {
  return (
    <div className={styles.card}>
      <img src={dishImage} alt={"food"} className={styles.image} />
      <div>
        <h2>{dishName}</h2>
        <p>Price: {dishPrice}</p>
      </div>
    </div>
  );
}

export default CartCard;
