"use client";
import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function page({ params }) {
  const { order_id } = params;
  const [orderStatus, setOrderStatus] = useState();
  const [orderCreatedAt, setOrderCreatedAt] = useState();
  const [orderPrice, setOrderPrice] = useState();
  const [orderDishes, setOrderDishes] = useState([]);
  // const [orderInfo, setOrderInfo] = useState();
  const getOrder = () => {
    const accessToken = localStorage.getItem("token");

    fetch(`/api/order/${order_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
        setOrderStatus(data.status);
        setOrderCreatedAt(data.createdAt);
        setOrderPrice(data.price);
        setOrderDishes([...data.dishes]);
      })
      .catch((error) => console.error("Error getting order:", error));
  };

  useEffect(() => {
    getOrder();
  }, []);

  // return a stylized html card that has all the order information
  return (
    <div>
      <h1>Order Info</h1>
      <p>Order Status: {orderStatus}</p>
      <p>Created at: {orderCreatedAt}</p>
      <p>Order total price: {orderPrice}$</p>
      <p>Order Items: </p>
      {orderDishes.map((dish, index) => {
        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexdirection: "row",
              height: "120px",
              width: "100%",
              padding: "12px",
              borderRadius: "var(--border-radius)",
              background: "rgba(var(--card-rgb), 0.15)",
              border: "1px solid rgba(var(--card-border-rgb), 0)",
              transition: "background 200ms, border 200ms",
              alignSelf: "center",
              margin: "0 auto",
              marginBottom: "12px",
              gap: "12px",
            }}
          >
            <img
              src={dish.dishImage}
              alt={"food"}
              style={{
                width: "20%",
                height: "100%",
                borderRadius: "4px",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <h2>
              {dish.dishName} <span>-&gt;</span>
            </h2>
            <p>Price: {dish.dishPrice}$</p>
          </div>
        );
      })}
    </div>
  );
}
