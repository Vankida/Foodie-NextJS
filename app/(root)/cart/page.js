"use client";
import React, { useEffect } from "react";
import CartCard from "@/app/components/cartCard/CartCard";

function cartPage() {
  const getCartItems = () => {
    const accessToken = localStorage.getItem("token");
    fetch("/api/cart", {
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
    getCartItems();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h1>Your cart</h1>
      <CartCard />
    </div>
  );
}

export default cartPage;
