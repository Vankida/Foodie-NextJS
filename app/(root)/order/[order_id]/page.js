"use client";
import React from "react";
import { useEffect } from "react";
export default function page({ params }) {
  const { order_id } = params;

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
      })
      .catch((error) => console.error("Error getting order:", error));
  };

  useEffect(() => {
    getOrder();
  }, []);

  return <div>yaaaoooo</div>;
}
