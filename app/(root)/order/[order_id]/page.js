"use client";
import React from "react";
import { useEffect, useState } from "react";
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
        setOrderStatus(data.order.status);
        setOrderCreatedAt(data.order.createdAt);
        setOrderPrice(data.order.price);
        setOrderDishes(...data.order.dishes);
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
    </div>
  );
}
