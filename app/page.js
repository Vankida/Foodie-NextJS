"use client";
import { useEffect, useState } from "react";
import DishCard from "./components/dishCard/DishCard";
import styles from "./homePage.module.css";

export default function Home() {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    fetch("/api/dish", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
        setDishes([...data.dishes]);
      })
      .catch((error) => console.error("Error fetching dishes:", error));
  }, []);

  return (
    <div className={styles.grid}>
      {dishes.map((item, index) => {
        return (
          <DishCard
            dishID={item._id}
            link={item.image}
            header={item.name}
            details={item.description}
            key={index}
          />
        );
      })}
    </div>
  );
}
