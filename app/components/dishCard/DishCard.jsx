"use client";
import React from "react";
import styles from "./dishCard.module.css";
import Link from "next/link";
import { StarRating } from "../StarRating";

function DishCard({ dishID, link, header, details, rating, price }) {
  const handleSubmit = (event) => {
    // fetch(`/api/cart/${dishID}`, {

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

  return (
    <div className={styles.card}>
      <Link className={styles.cardLink} href={`/${dishID}`}>
        <img src={link} alt={"food"} className={styles.image} />
        <h2>
          {header} <span>-&gt;</span>
        </h2>
        <p>{details}</p>
        <p>Rating: {rating}/10</p>
        <p>Price: {price}$</p>
      </Link>
      <StarRating initialRating={rating} itemID={dishID} />
      <button className={styles.button} onClick={(e) => handleSubmit(e)}>
        Add to cart
      </button>
    </div>
  );
}

export default DishCard;
