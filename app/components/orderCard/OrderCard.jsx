"use client";
// import React, { useEffect, useState } from "react";
import styles from "./orderCard.module.css";
import Link from "next/link";

function OrderCard({ orderID, orderDate, deliveryTime, status }) {
  return (
    <Link href={`/order/${orderID}`} className={styles.card}>
      <h2>Order from: {orderDate}</h2>
      <p>Delivery time: {deliveryTime}</p>
      <p>Status: {status}</p>
    </Link>
  );
}

export default OrderCard;
