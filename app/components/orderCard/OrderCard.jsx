"use client";
// import React, { useEffect, useState } from "react";
import styles from "./orderCard.module.css";

function OrderCard({ orderID, orderDate, deliveryTime, status }) {
  return (
    <div className={styles.card}>
      <h2>Order from: {orderDate}</h2>
      <p>Delivery time: {deliveryTime}</p>
      <p>Status: {status}</p>
    </div>
  );
}

export default OrderCard;
