"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

const AuthLinks = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    // Redirect to the home page
    window.location.href = "/";
  };

  return (
    <>
      {!isAuthenticated ? (
        <>
          <Link href="/signup" className={styles.link}>
            Signup
          </Link>
          <Link href="/login" className={styles.loginLink}>
            Login
          </Link>
        </>
      ) : (
        <>
          <Link href="/profile" className={styles.link}>
            Profile
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
      <div className={styles.burger} onClick={() => setOpen(!open)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {open && (
        <div className={styles.responsiveMenu}>
          {/* <Link href="/">Menu</Link>
          <Link href="/">Orders</Link>
          <Link href="/">Cart</Link> */}
          {!isAuthenticated ? (
            <>
              <Link href="/signup">Signup</Link>
              <Link href="/login">Login</Link>
            </>
          ) : (
            <>
              <Link href="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;
