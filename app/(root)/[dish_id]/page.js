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

  // Edit dish variables
  const [newDishName, setNewDishName] = useState("");
  const [newDishDescription, setNewDishDescription] = useState("");
  const [newDishPrice, setNewDishPrice] = useState(0);
  const [newDishImage, setNewDishImage] = useState("");
  const [newIsDishVegeterian, setNewIsDishVegeterian] = useState(false);
  const [newDishRating, setNewDishRating] = useState(0);
  const [newDishPage, setNewDishPage] = useState(1);
  const [newDishCategory, setNewDishCategory] = useState("Wok");
  const [formComplete, setFormComplete] = useState(false);

  useEffect(() => {
    if (newDishName && newDishDescription && newDishImage) {
      setFormComplete(true);
    } else {
      setFormComplete(false);
    }
  }, [newDishName, newDishDescription, newDishImage]);

  const [dishBeingEdited, setDishBeingEdited] = useState(false);

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

        setNewDishName(data.dish.name);
        setNewDishDescription(data.dish.description);
        setNewDishPrice(data.dish.price);
        setNewDishImage(data.dish.image);
        setNewIsDishVegeterian(data.dish.vegeterian);
        setNewDishRating(data.dish.rating);
        setNewDishPage(data.dish.page);
        setNewDishCategory(data.dish.category);
      })
      .catch((error) => console.error("Error fetching the dish:", error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // construct the data object to send in the request body
    const data = {
      name: newDishName,
      description: newDishDescription,
      price: newDishPrice,
      image: newDishImage,
      vegeterian: newIsDishVegeterian,
      rating: newDishRating,
      category: newDishCategory,
      page: newDishPage,
    };
    console.log(data);

    const accessToken = localStorage.getItem("token");
    // send the PUT request to update the dish
    fetch(`/api/dish/${dish_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
        if (data.success === true) alert("success");
      })
      .catch((error) => console.error("Error updating the dish:", error));

    // const accessToken = localStorage.getItem("token");
    // fetch("/api/dish", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    //   body: JSON.stringify(data),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data); // success
    //   })
    //   .catch((error) => console.error("Error creating dish:", error));
  };

  return (
    <>
      {!dishBeingEdited && (
        <div className={styles.card}>
          <h2>{dishName}</h2>
          <img src={dishImage} alt={"food"} className={styles.image} />
          <h4>Dish category: {dishCategory}</h4>
          {isDishVegeterian ? <h4>Vegeterian</h4> : <h4>Not vegeterian</h4>}
          <p>{dishDescription}</p>
          <h4>rating: {dishRating}</h4>
          <h4>price: {dishPrice}$ / dish</h4>

          {isAdmin && (
            <button
              type="submit"
              className={styles.editButton}
              onClick={() => setDishBeingEdited(true)}
            >
              Edit Dish
            </button>
          )}
        </div>
      )}
      {dishBeingEdited && (
        <div className={styles.container}>
          {isAdmin && (
            <button
              type="submit"
              className={styles.editButton}
              onClick={() => setDishBeingEdited(false)}
            >
              Cancel
            </button>
          )}
          <h1 className={styles.h1}>Edit Dish Info</h1>
          <div className={styles.form}>
            <div className={styles.inputContainer}>
              <label htmlFor="exampleFormControlInput1" className="form-label">
                <b>Dish Name</b>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="Dish Name"
                value={newDishName}
                onChange={(e) => setNewDishName(e.target.value)}
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
                value={newDishDescription}
                onChange={(e) => setNewDishDescription(e.target.value)}
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
                value={newDishPrice}
                onChange={(e) => setNewDishPrice(e.target.value)}
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
                value={newDishImage}
                onChange={(e) => setNewDishImage(e.target.value)}
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="exampleFormControlInput1" className="form-label">
                <b>Vegeterian?</b>
              </label>
              <input
                type="checkbox"
                value={newIsDishVegeterian}
                onChange={(e) => setNewIsDishVegeterian(e.target.checked)}
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
                value={newDishRating}
                onChange={(e) => setNewDishRating(e.target.value)}
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
                value={newDishPage}
                onChange={(e) => setNewDishPage(e.target.value)}
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="exampleFormControlInput1" className="form-label">
                <b>Dish Category</b>
              </label>
              <select
                className={styles.select}
                value={newDishCategory}
                onChange={(e) => setNewDishCategory(e.target.value)}
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
              disabled={!formComplete}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default page;
