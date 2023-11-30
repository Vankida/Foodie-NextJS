"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // const [isAuthenticated, setIsAuthenticated] = useState(
  //   localStorage.getItem("token")
  // );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // check if authenticated
  useEffect(() => {
    fetch("/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // success
        if (data.success === true) {
          setIsAuthenticated(true);
          setIsAdmin(data.user.admin);
          console.log("hello");
        }
      })
      .catch((error) => {
        console.error(error); // error
        setIsAuthenticated(false);
        console.log("hello2");
      });
  }, []);

  // const handleLogout = () => {
  //   fetch("/api/logout", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data); // success
  //     })
  //     .catch((error) => {
  //       console.error(error); // error
  //     });
  // };

  const login = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    // handleLogout();
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    console.log("logged out!");
  };

  const value = { isAuthenticated, isAdmin, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
