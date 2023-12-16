"use client";
import React, { useEffect, useState } from "react";
import CartCard from "@/app/components/cartCard/CartCard";

function ordersPage() {
  const [orders, setOrders] = useState([]);

  const getOrders = () => {
    const accessToken = localStorage.getItem("token");
    fetch("api/order", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
      })
      .catch((error) => console.error("Error adding dish:", error));
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <h1>Orders!</h1>
      {/* {cartItems.map((item, index) => {
          return <CartCard dishID={item.dishId} key={index} />;
        })} */}
    </div>
  );
}

export default ordersPage;
