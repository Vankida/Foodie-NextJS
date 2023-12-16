"use client";
import React, { useEffect, useState } from "react";
import CartCard from "@/app/components/cartCard/CartCard";

function cartPage() {
  const [cartItems, setCartItems] = useState([]);

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
        setCartItems([...data.existingCart.dishes]);
        // console.log(data.existingCart.dishes);
      })
      .catch((error) => console.error("Error adding dish:", error));
  };

  useEffect(() => {
    getCartItems();
  }, []);

  const handleMakeOrder = () => {
    console.log("yoo");
    const accessToken = localStorage.getItem("token");

    const currentDate = new Date();
    const deliveryTime = currentDate.toISOString();
    const data = {
      deliveryTime: deliveryTime,
      address: "test_address",
    };

    fetch("api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
      })
      .catch((error) => console.error("Error placing order:", error));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        // justifyContent: "center",
        // alignItems: "center",
        width: "100%",
        // backgroundColor: "green",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "flex-start",
          alignItems: "flex-start",
          width: "75%",
          // backgroundColor: "yellow",
        }}
      >
        {cartItems.map((item, index) => {
          return <CartCard dishID={item.dishId} key={index} />;
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <p>Total: 125$</p>
        <button onClick={handleMakeOrder}>Order</button>
      </div>
    </div>
  );
}

export default cartPage;
