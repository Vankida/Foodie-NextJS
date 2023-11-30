"use client";
import React from "react";
import { useState, useEffect } from "react";
import styles from "./addDishPage.module.css";

function addDishPage() {
  const [dishName, setDishName] = useState("");
  const [dishDescription, setDishDescription] = useState("");
  const [dishPrice, setDishPrice] = useState(0);
  const [dishImage, setDishImage] = useState("");
  const [isDishVegeterian, setIsDishVegeterian] = useState(false);
  const [dishRating, setDishRating] = useState(0);
  const [dishPage, setDishPage] = useState(1);
  const [dishCategory, setDishCategory] = useState("Wok");
  const [formComplete, setFormComplete] = useState(false);

  useEffect(() => {
    if (dishName && dishDescription && dishImage) {
      setFormComplete(true);
    } else {
      setFormComplete(false);
    }
    console.log(isDishVegeterian);
  }, [dishName, dishDescription, dishImage, isDishVegeterian]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // construct the data object to send in the request body
    const data = {
      name: dishName,
      description: dishDescription,
      price: dishPrice,
      image: dishImage,
      vegeterian: isDishVegeterian,
      rating: dishRating,
      category: dishCategory,
      page: dishPage,
    };
    console.log(data);

    const accessToken = localStorage.getItem("token");
    fetch("/api/dish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
      })
      .catch((error) => console.error("Error creating dish:", error));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Add Dish Info</h1>
      <div className={styles.form}>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Dish Name</b>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Dish Name"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Dish Description</b>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Dish Description"
            value={dishDescription}
            onChange={(e) => setDishDescription(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Dish Price</b>
          </label>
          <input
            type="number"
            className={styles.input}
            placeholder="Dish Price"
            value={dishPrice}
            onChange={(e) => setDishPrice(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Dish Image Link</b>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Dish Image"
            value={dishImage}
            onChange={(e) => setDishImage(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Vegeterian?</b>
          </label>
          <input
            type="checkbox"
            value={isDishVegeterian}
            onChange={(e) => setIsDishVegeterian(e.target.checked)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Dish Rating</b>
          </label>
          <input
            type="number"
            className={styles.input}
            placeholder="Dish Rating"
            value={dishRating}
            onChange={(e) => setDishRating(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Dish Page</b>
          </label>
          <input
            type="number"
            className={styles.input}
            placeholder="Dish Page"
            value={dishPage}
            onChange={(e) => setDishPage(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Dish Category</b>
          </label>
          <select
            className={styles.select}
            value={dishCategory}
            onChange={(e) => setDishCategory(e.target.value)}
          >
            <option className={styles.option}>Wok</option>
            <option className={styles.option}>Pizza</option>
            <option className={styles.option}>Soup</option>
            <option className={styles.option}>Dessert</option>
            <option className={styles.option}>Drink</option>
          </select>
        </div>
        <button
          type="submit"
          className={styles.registerButton}
          onClick={handleSubmit}
          disabled={!formComplete}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default addDishPage;
