import React from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * Represents a registration page.
 *
 * @page
 * @param {Object} props - The page props.
 * @returns {React.ReactElement} A registration page element.
 */
function Registration() {
  const navigate = useNavigate();

  /**
   * Send request with register informations to register an account to backend.
   * Navigate to login page when the response is HTTP-200
   *
   * @api register
   * @param {Event} e - The event object from the form submission.
   * @returns null.
   */
  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const registrationInfo = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      birthday: formData.get("birthday"),
      gender: formData.get("gender"),
      country: formData.get("country"),
      isPublic: formData.get("type") === "Public" ? true : false,
    };

    for (const field in registrationInfo) {
      if (registrationInfo[field] === "") {
        alert(`${field} is null`);
        return;
      }
    }

    const response = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(registrationInfo),
    });

    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      alert(data.message);
      navigate("/login");
    } else {
      const data = await response.json();
      if (data.message === "Duplicated username") {
        alert("Duplicated username. Please try again.");
      } else {
        alert("Failed to register. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {/* 
        This is a multi-line comment in JSX. 
        It provides information about the register page. 
        The body of card component contains forms allow user input informations like username,
        password, email, etc.
        Under the card body create account button and Echofy logo is displayed. 
      */}
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <Card.Title className="text-center">Create your account</Card.Title>
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="name" className="mt-4">
              <Form.Control type="text" placeholder="Name" name="username" />
            </Form.Group>

            <Form.Group controlId="email" className="mt-4">
              <Form.Control type="email" placeholder="Email" name="email" />
            </Form.Group>

            <Form.Group controlId="password" className="mt-4">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
              />
            </Form.Group>

            <Form.Group controlId="birthday" className="mt-4">
              <Form.Control
                type="date"
                placeholder="Birthday"
                name="birthday"
              />
            </Form.Group>

            <Form.Group controlId="gender" className="mt-4">
              <Form.Control
                as="select"
                placeholder="Select Gender"
                name="gender"
              >
                <option>Other</option>
                <option>Male</option>
                <option>Female</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="country" className="mt-4">
              <Form.Control
                type="text"
                placeholder="Country/Region"
                name="country"
              />
            </Form.Group>

            <Form.Group controlId="type" className="mt-4">
              <Form.Control
                as="select"
                placeholder="Select Account Type"
                name="type"
              >
                <option>Public</option>
                <option>Private</option>
              </Form.Control>
            </Form.Group>

            <div className="d-grid mt-4">
              <Button variant="dark" size="lg" type="submit">
                Create account
              </Button>
            </div>
          </Form>
        </Card.Body>
        <div className="mt-1 mb-3 text-center">
          <img src="/logo.png" alt="Logo" height="40" />
        </div>
      </Card>
    </div>
  );
}

export default Registration;
