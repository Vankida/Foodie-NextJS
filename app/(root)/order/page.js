"use client";
import React, { useEffect, useState } from "react";
import OrderCard from "@/app/components/orderCard/OrderCard";

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
        setOrders([...data.orders]);
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {orders.map((item, index) => {
          return (
            <OrderCard
              orderID={item._id}
              key={index}
              orderDate={item.createdAt}
              deliveryTime={item.deliveryTime}
              status={item.status}
            />
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      ></div>
    </div>
  );
}

export default ordersPage;
