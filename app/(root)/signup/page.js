"use client";
import styles from "./signUpPage.module.css";
import { useState, useEffect } from "react";
import InputMask from "react-input-mask";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formComplete, setFormComplete] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    if (name && email && gender && dob && address && password) {
      setFormComplete(true);
    } else {
      setFormComplete(false);
    }
  }, [name, email, gender, dob, address, password]);

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleChangeGender = (event) => {
    setGender(event.target.value);
  };

  const handleChangeDob = (event) => {
    setDob(event.target.value);
  };

  const handleChangeAddress = (event) => {
    setAddress(event.target.value);
  };

  const handleChangePhone = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isValidEmail(email)) alert("Please enter a valid email address.");
    if (!isValidPhone(phoneNumber))
      alert("Please enter a valid Russian phone number.");
    if (!isValidPassword(password))
      alert("Password length should be 6 or more");

    if (
      isValidEmail(email) &&
      isValidPhone(phoneNumber) &&
      isValidPassword(password)
    ) {
      // construct the data object to send in the request body
      const data = {
        fullName: name,
        password: password,
        email: email,
        address: address,
        birthDate: dob,
        gender: gender,
        phoneNumber: phoneNumber,
      };
      console.log(data);

      setCreatingUser(true);
      // make the API request to register the user "/api/account/register"
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // success
          setCreatingUser(false);
          alert("User Created!");
        })
        .catch((error) => {
          console.error(error); // error
          setCreatingUser(false);
          alert("Error");
        });
    }
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phoneNumber) => {
    if (!phoneNumber.length) return false;
    const regex = /^(\+7 \(\d{0,3}?\) \d{0,3}(-\d{0,2}){0,2}){0,2}$/;
    return regex.test(phoneNumber) && phoneNumber.match(/\d/g).length === 11;
  };

  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Register</h1>
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
            onChange={handleChangeName}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Gender</b>
          </label>
          <select
            className={styles.select}
            value={gender}
            onChange={handleChangeGender}
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
            type="email"
            className={styles.input}
            placeholder="email@example.com"
            value={email}
            onChange={handleChangeEmail}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            <b>Password</b>
          </label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={handleChangePassword}
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
            onChange={handleChangeDob}
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
            onChange={handleChangeAddress}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            <b>Phone number</b>
          </label>
          <InputMask
            mask="+7 (999) 999-99-99"
            value={phoneNumber}
            onChange={handleChangePhone}
            className={styles.input}
            placeholder="+7 (___) ___-__-__"
          />
        </div>
        <button
          type="submit"
          className={styles.registerButton}
          onClick={handleSubmit}
          disabled={!formComplete | creatingUser}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default SignUpPage;
