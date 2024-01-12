"use client";
import React, { useEffect, useState } from "react";
import styles from "./cartCard.module.css";

function CartCard({ dishID, dishName, dishPrice, totalPrice, dishImage }) {
  const handleRemoveDish = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("token");
    fetch(`/api/cart/${dishID}?increase=${true}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
      });
  };

  return (
    <div className={styles.card}>
      <img src={dishImage} alt={"food"} className={styles.image} />
      <div>
        <h2>{dishName}</h2>
        <p>Price: {dishPrice}</p>
      </div>
      <div>
        <button onClick={(e) => handleRemoveDish(e)}>Remove dish</button>
      </div>
    </div>
  );
}

export default CartCard;
