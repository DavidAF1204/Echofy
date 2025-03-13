import React, { useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * Represents a login page.
 *
 * @page
 * @param {Object} props - The page props.
 * @returns {React.ReactElement} A login page element.
 */
function Login() {
  const navigate = useNavigate();

  /**
   * fetch user data by token from backend.
   * Stored the data to  {useState} username, user id and user type when the request is HTTP-200
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
            if (decode.userType === "admin" || decode.userType === "user") {
              navigate("/");
            }
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    handleAuth();
  }, []);

  /**
   * send the login page info to do authentications
   * Sign cookie and redirect pages when the request is HTTP-200
   *
   * @api login
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const loginInfo = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const auth = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    });

    if (auth.ok) {
      const res = await auth.json();
      console.log(res);
      document.cookie = `Echofyjwtsign=${res.token}; path:/`;
      if (res.userType === "admin") {
        console.log("Admin");
        navigate("/");
        return;
      } else {
        console.log("User");
        navigate("/");
        return;
      }
    } else {
      alert("Wrong username or password");
      return;
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {/* 
          This is a multi-line comment in JSX. 
          It provides information about the login page component. 
          The card component contains the login title, user name place holder, password placeholder,
          login button and sign up element
      */}
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            Sign in to ECHOFY
          </Card.Title>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username">
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
              />
            </Form.Group>

            <Form.Group controlId="password" className="mt-4">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
              />
            </Form.Group>

            <div className="d-grid mt-4">
              <Button variant="dark" size="lg" type="submit">
                Log in
              </Button>
            </div>
          </Form>
          <p className="text-center mt-4">
            Don't have an account? <a href="/registration">Sign up</a>
          </p>
          <div className="text-center">
            <img src="/logo.png" alt="Logo" height="40" />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
