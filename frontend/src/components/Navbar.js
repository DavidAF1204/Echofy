import React, { useState, useEffect } from "react";
import NavbarAdmin from "./NavbarAdmin";
import NavbarLoggedIn from "./NavbarLoggedIn";
import NavbarNoLoggedIn from "./NavbarNoLoggedIn";

/**
 * Represents a navigation bar component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {React.ReactElement} A navigation bar element.
 */
function Navbar() {
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");

  /**
   * Once the component is loaded, fetch user data by token from backend.
   * Stored the data to  {useState} username and user type when the request is HTTP-200
   *
   * @api protected
   */
  useEffect(() => {
    const handleAuth = async () => {
      const jwtCookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("Echofyjwtsign="));
      if (jwtCookie) {
        try {
          const jwtToken = jwtCookie.split("=")[1];
          const res = await fetch("http://localhost:3001/protected", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ jwtToken }),
          });

          if (res.ok) {
            const { decode } = await res.json();
            setUserType(decode.userType);
            setUsername(decode.username);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    handleAuth();
  }, []);

  {
    /* 
        This is a multi-line comment in JSX. 
        It provides information about the Navbar component. 
        The different kind of navigation bar would be rendered according to the status. 
    */
  }
  if (username !== "") {
    if (userType === "admin") {
      return <NavbarAdmin />;
    } else {
      return <NavbarLoggedIn />;
    }
  } else {
    return <NavbarNoLoggedIn />;
  }
}

export default Navbar;
