"use client";
import React from "react";
import styles from "./dishPage.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

function page({ params }) {
  const { dish_id } = params;
  const { isAdmin } = useAuth();

  const [dishName, setDishName] = useState("");
  const [dishDescription, setDishDescription] = useState("");
  const [dishPrice, setDishPrice] = useState(0);
  const [dishImage, setDishImage] = useState("");
  const [isDishVegeterian, setIsDishVegeterian] = useState(false);
  const [dishRating, setDishRating] = useState(0);
  const [dishPage, setDishPage] = useState(1);
  const [dishCategory, setDishCategory] = useState("Wok");

  useEffect(() => {
    fetch(`/api/dish/${dish_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
        setDishName(data.dish.name);
        setDishDescription(data.dish.description);
        setDishPrice(data.dish.price);
        setDishImage(data.dish.image);
        setIsDishVegeterian(data.dish.vegeterian);
        setDishRating(data.dish.rating);
        setDishPage(data.dish.page);
        setDishCategory(data.dish.category);
      })
      .catch((error) => console.error("Error fetching the dish:", error));
  }, []);

  return (
    <div className={styles.card}>
      <h2>{dishName}</h2>
      <img src={dishImage} alt={"food"} className={styles.image} />
      <h4>Dish category: {dishCategory}</h4>
      {isDishVegeterian ? <h4>Vegeterian</h4> : <h4>Not vegeterian</h4>}
      <p>{dishDescription}</p>
      <h4>rating: {dishRating}</h4>
      <h4>price: {dishPrice}$ / dish</h4>

      {isAdmin && (
        <button type="submit" className={styles.editButton}>
          Edit Dish
        </button>
      )}
    </div>
  );
}

export default page;
