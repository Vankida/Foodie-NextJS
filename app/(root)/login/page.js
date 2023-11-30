"use client";
import styles from "./logInPage.module.css";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { redirect } from "next/navigation";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formComplete, setFormComplete] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const { login } = useAuth();

  useEffect(() => {
    if (email && password) {
      setFormComplete(true);
    } else {
      setFormComplete(false);
    }
  }, [email, password]);

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isValidEmail(email)) {
      // construct the data object to send in the request body
      const data = {
        email: email,
        password: password,
      };
      console.log(data);

      setLoggingIn(true);

      //   make the API request to login the user "/api/account/login"
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // success
          setLoggingIn(false);
          alert(data.message);

          if (data.success) {
            // Redirect to the home page
            window.location.href = "/";
            // return redirect("/");
            login(data.token);
          }
        })
        .catch((error) => {
          console.error(error); // error
          setLoggingIn(false);
          alert("Error");
        });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Login</h1>
      <div className={styles.form}>
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
        <button
          type="submit"
          className={styles.registerButton}
          onClick={handleSubmit}
          disabled={!formComplete | loggingIn}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
