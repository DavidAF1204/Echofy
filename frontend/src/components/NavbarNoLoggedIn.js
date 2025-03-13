import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";

/**
 * Represents a not logged in navigation bar component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {React.ReactElement} A not logged in navigation bar element.
 */
function NavbarNoLoggedIn() {
  return (
    <Navbar
      bg="light"
      className="flex-column align-items-start"
      style={{
        width: "310px",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
      }}
    >
      {/* 
          This is a multi-line comment in JSX. 
          It provides information about the NavbarNoLoggedIn component. 
          The Navigation bar contains the logo of Echofy ,home page icon and button,
          and Buttons directs to login page and registration page correspondingly.
      */}
      <Navbar.Brand href="/" className="ms-5">
        <img src="/Navbar/brand.png" alt="ECHOFY" height="70" />
      </Navbar.Brand>
      <Nav className="flex-column">
        <Button variant="link" href="/">
          <img src="/Navbar/Home.png" alt="Home" height="50" />
        </Button>

        <div className="mt-4 ms-5" style={{ paddingTop: "435px" }}>
          <Button variant="outline-dark" href="/login" className="mt-1 ms-3">
            Login
          </Button>
          <Button
            variant="outline-dark"
            href="/registration"
            className="mt-1 ms-3"
          >
            Sign up
          </Button>
        </div>
      </Nav>
    </Navbar>
  );
}

export default NavbarNoLoggedIn;
