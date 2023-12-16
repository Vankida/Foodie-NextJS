"use client";
import React, { useEffect, useState } from "react";
import styles from "./cartCard.module.css";

function CartCard({ dishID, link, header, details }) {
  const [dishName, setDishName] = useState("");
  // const [dishDescription, setDishDescription] = useState("");
  const [dishPrice, setDishPrice] = useState(0);
  const [dishImage, setDishImage] = useState("");
  // const [isDishVegeterian, setIsDishVegeterian] = useState(false);
  // const [dishRating, setDishRating] = useState(0);

  useEffect(() => {
    fetch(`/api/dish/${dishID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
        setDishName(data.dish.name);
        setDishPrice(data.dish.price);
        setDishImage(data.dish.image);
      })
      .catch((error) => console.error("Error fetching the dish:", error));
  }, []);

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
