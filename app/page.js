"use client";
import { useEffect, useState } from "react";
import DishCard from "./components/dishCard/DishCard";
import styles from "./homePage.module.css";
import Select from "react-select";
// import { Dropdown } from "primereact/dropdown";
// import ReactPaginate from 'react-paginate';
import { useRouter, useSearchParams } from "next/navigation";

import Pagination from "@mui/material/Pagination";
// import { makeStyles } from "@mui/styles";
// import Stack from "@mui/material/Stack";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dishes, setDishes] = useState([]);
  const [searchParamsURL, setSearchParamsURL] = useState(
    "?" + searchParams.toString()
  );

  useEffect(() => {
    fetch(`/api/dish${searchParamsURL}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
        setDishes([...data.dishes]);
      })
      .catch((error) => console.error("Error fetching dishes:", error));

    console.log(searchParamsURL);
  }, [searchParamsURL]);

  const categories = [
    { value: "Wok", label: "Wok" },
    { value: "Pizza", label: "Pizza" },
    { value: "Soup", label: "Soup" },
    { value: "Dessert", label: "Dessert" },
    { value: "Drink", label: "Drink" },
  ];
  const sorting = [
    { value: "NameAsc", label: "NameAsc" },
    { value: "NameDesc", label: "NameDesc" },
    { value: "PriceAsc", label: "PriceAsc" },
    { value: "PriceDesc", label: "PriceDesc" },
    { value: "RatingAsc", label: "RatingAsc" },
    { value: "RatingDesc", label: "RatingDesc" },
  ];

  const colourStyles = {
    menu: (styles) => ({
      ...styles,
      backgroundColor: "#242424",
      color: "white",
    }),
    container: (styles) => ({
      ...styles,
      backgroundColor: "#242424",
      color: "white",
      width: "20%",
      minWidth: "80px",
      margin: "0 auto",
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: "#242424",
      color: "white",
    }),
    option: (styles) => ({
      ...styles,
      backgroundColor: "#242424",
      color: "white",

      ":active": {
        ...styles[":active"],
        backgroundColor: "white",
      },
    }),
    input: (styles) => ({ ...styles }),
    placeholder: (styles) => ({ ...styles }),
    singleValue: (styles) => ({ ...styles, color: "white" }),
  };

  // Add is vegetarian and the page.
  // const router = useRouter();
  // const searchParams = useSearchParams();

  const handleCategoryChange = (selectedCategories) => {
    let categories;
    if (selectedCategories) {
      categories = selectedCategories
        ? selectedCategories.map((category) => category.value)
        : [];
    }
    const query = categories
      .map((category) => `categories=${category}`)
      .join("&");
    const arr = searchParams.toString().split("&");
    const filteredArr = arr.filter((item) => !item.startsWith("categories"));
    let newURL = filteredArr.join("&");
    let finalURL = `/?${query}` + `&${newURL}`;
    !newURL.includes("sorting") &&
    !newURL.includes("page") &&
    !newURL.includes("vegetarian")
      ? (finalURL = finalURL.slice(0, -1))
      : "";
    router.push(finalURL);
    setSearchParamsURL(finalURL);
  };

  const handleSortingChange = (selectedSorting) => {
    const sorting = selectedSorting ? selectedSorting.value : null;
    const query = sorting ? `sorting=${sorting}` : "";
    const url = searchParams.toString();
    const queryExists = searchParams.toString();
    if (queryExists) {
      if (searchParams.get("sorting")) {
        const updatedURL = url.replace(/(sorting=)[^&]+/, `$1${sorting}`);
        router.replace(`/?` + updatedURL);
        setSearchParamsURL(`/?` + updatedURL);
      } else {
        router.push("/?" + searchParams.toString() + `&${query}`);
        setSearchParamsURL("/?" + searchParams.toString() + `&${query}`);
      }
    } else {
      if (searchParams.get("sorting")) {
        const updatedURL = url.replace(/(sorting=)[^&]+/, `$1${sorting}`);
        router.replace(`/?` + updatedURL);
        setSearchParamsURL(`/?` + updatedURL);
      } else {
        router.push(`/?${query}`);
        setSearchParamsURL(`/?${query}`);
      }
    }
  };

  const handleVegetarianChange = (checked) => {
    const query = `vegetarian=${checked}`;
    const url = searchParams.toString();
    const queryExists = searchParams.toString();
    if (queryExists) {
      if (searchParams.get("vegetarian")) {
        const updatedURL = url.replace(/(vegetarian=)[^&]+/, `$1${checked}`);
        router.replace(`/?` + updatedURL);
        setSearchParamsURL(`/?` + updatedURL);
      } else {
        router.push("/?" + searchParams.toString() + `&${query}`);
        setSearchParamsURL("/?" + searchParams.toString() + `&${query}`);
      }
    } else {
      if (searchParams.get("vegetarian")) {
        const updatedURL = url.replace(/(vegetarian=)[^&]+/, `$1${checked}`);
        router.replace(`/?` + updatedURL);
        setSearchParamsURL(`/?` + updatedURL);
      } else {
        router.push(`/?${query}`);
        setSearchParamsURL(`/?${query}`);
      }
    }
  };

  const handlePageChange = (event, page) => {
    // 'page' parameter contains the active page
    console.log(page);
    // console.log(searchParams.get("page"));

    const query = `page=${page}`;
    const url = searchParams.toString();
    const queryExists = searchParams.toString();
    if (queryExists) {
      if (searchParams.get("page")) {
        const updatedURL = url.replace(/(page=)[^&]+/, `$1${page}`);
        router.replace(`/?` + updatedURL);
        setSearchParamsURL(`/?` + updatedURL);
      } else {
        router.push("/?" + searchParams.toString() + `&${query}`);
        setSearchParamsURL("/?" + searchParams.toString() + `&${query}`);
      }
    } else {
      if (searchParams.get("page")) {
        const updatedURL = url.replace(/(page=)[^&]+/, `$1${page}`);
        router.replace(`/?` + updatedURL);
        setSearchParamsURL(`/?` + updatedURL);
      } else {
        router.push(`/?${query}`);
        setSearchParamsURL(`/?${query}`);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <div className={styles.filtersContainer}>
        <Select
          defaultValue={"none"}
          options={categories}
          isClearable
          styles={colourStyles}
          isMulti
          onChange={(selectedCategories) =>
            handleCategoryChange(selectedCategories, null)
          }
        />
        <Select
          defaultValue={"none"}
          options={sorting}
          isClearable
          styles={colourStyles}
          onChange={(selectedSorting) => handleSortingChange(selectedSorting)}
        />
        <input
          id="checkbox"
          type="checkbox"
          onChange={(e) => handleVegetarianChange(e.target.checked)}
        />
        <label htmlFor="checkbox">vegetarian</label>
      </div>
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

      <Pagination
        count={4}
        defaultPage={1}
        variant="outlined"
        color="primary"
        sx={{
          button: {
            color: "white",
          },
        }}
        onChange={handlePageChange}
      />
    </div>
  );
}
