"use client";
import React, { useEffect, useState } from "react";
import styles from "./cartCard.module.css";

function CartCard({ dishID, dishName, dishPrice, totalPrice, dishImage }) {
  const handleDecDish = (event) => {
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
  const handleIncDish = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("token");
    fetch(`/api/cart/${dishID}`, {
      method: "POST",
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
  const handleRemoveDish = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("token");
    fetch(`/api/cart/${dishID}?increase=${false}`, {
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          justifyItems: "center",
          width: "24px",
        }}
      >
        <button onClick={(e) => handleDecDish(e)}>-</button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          justifyItems: "center",
          width: "24px",
        }}
      >
        <button onClick={(e) => handleIncDish(e)}>+</button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          justifyItems: "center",
          width: "72px",
        }}
      >
        <button onClick={(e) => handleRemoveDish(e)}>Remove all</button>
      </div>
    </div>
  );
}

export default CartCard;
