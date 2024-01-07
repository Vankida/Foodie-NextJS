"use client";
// import React, { useEffect, useState } from "react";
import styles from "./orderCard.module.css";
import Link from "next/link";

function OrderCard({ orderID, orderDate, deliveryTime, status }) {
  const confirmOrder = (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("token");

    fetch(`/api/order/${orderID}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
      })
      .catch((error) => console.error("Error getting order:", error));
  };

  return (
    <Link href={`/order/${orderID}`} className={styles.card}>
      <h2>Order from: {orderDate}</h2>
      <p>Delivery time: {deliveryTime}</p>
      <p>Status: {status}</p>
      <button onClick={(e) => confirmOrder(e)}>Confirm Order</button>
    </Link>
  );
}

export default OrderCard;
