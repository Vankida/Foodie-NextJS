"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { redirect } from "next/navigation";
import styles from "./profilePage.module.css";
import InputMask from "react-input-mask";

function profilePage() {
  // const { isAuthenticated } = useAuth();
  // if (!isAuthenticated) {
  //   return redirect("/");
  // }

  const [admin, setAdmin] = useState(false);

  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formComplete, setFormComplete] = useState(false);

  useEffect(() => {
    console.log("opened profile");
    const accessToken = localStorage.getItem("token");
    // make the API request to get the profile info
    fetch("/api/account/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success

        setAdmin(data.user.admin);

        setName(data.user.fullName);
        setGender(data.user.gender);
        setDob(data.user.birthDate.substring(0, 10));
        setAddress(data.user.address);
        setPhoneNumber(data.user.phoneNumber);
      })
      .catch((error) => {
        console.error(error); // error
      });
  }, []);

  useEffect(() => {
    if (name && gender && dob && address) {
      setFormComplete(true);
    } else {
      setFormComplete(false);
    }
    console.log(name);
  }, [name, gender, dob, address]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isValidPhone(phoneNumber))
      alert("Please enter a valid Russian phone number.");

    if (isValidPhone(phoneNumber)) {
      // construct the data object to send in the request body
      const data = {
        fullName: name,
        address: address,
        birthDate: dob,
        gender: gender,
        phoneNumber: phoneNumber,
      };
      console.log(data);

      const accessToken = localStorage.getItem("token");
      // send the PUT request to update the user profile
      fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // success
          if (data.success === true) alert("success");
        })
        .catch((error) => console.error("Error updating profile:", error));
    }
  };

  const isValidPhone = (phoneNumber) => {
    if (!phoneNumber.length) return false;
    const regex = /^(\+7 \(\d{0,3}?\) \d{0,3}(-\d{0,2}){0,2}){0,2}$/;
    return regex.test(phoneNumber) && phoneNumber.match(/\d/g).length === 11;
  };

  return (
    <div className={styles.container}>
      {admin && (
        <div className={styles.adminButtonsContainer}>
          <Link href="/add-dish" className={styles.adminButton}>
            Add Dish
          </Link>
        </div>
      )}

      <h1 className={styles.h1}>Profile Info</h1>
      <div className={styles.form}>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Name</b>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Gender</b>
          </label>
          <select
            className={styles.select}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option className={styles.option}>Male</option>
            <option className={styles.option}>Female</option>
          </select>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            <b>Email</b>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="example@gmail.com"
            disabled="true"
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            <b>Date of birth</b>
          </label>
          <input
            type="date"
            className={styles.input}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            <b>Address</b>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="36 Lenina"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            <b>Phone number</b>
          </label>
          <InputMask
            mask="+7 (999) 999-99-99"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={styles.input}
            placeholder="+7 (___) ___-__-__"
          />
        </div>
        <button
          type="submit"
          className={styles.registerButton}
          onClick={handleSubmit}
          disabled={!formComplete}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default profilePage;
