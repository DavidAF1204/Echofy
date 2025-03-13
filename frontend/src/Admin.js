import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SuspendedEchoesTable from "./components/SuspendedEchoesTable";
import AllEchoesTable from "./components/AllEchoesTable";
import SuspendedUsersTable from "./components/SuspendedUsersTable";
import AllUsersTable from "./components/AllUsersTable";

/**
 * Represents a admin page component.
 *
 * @page
 * @returns {React.ReactElement} A admin page element.
 */

function Admin() {
  const [activeTable, setActiveTable] = useState(0);
  const navigate = useNavigate();

  /**
   * fetch user data by token from backend.
   * Stored the data to  {useState} username, user id and user type when the request is HTTP-200
   *
   * @api protected
   */
  useEffect(() => {
    const handleAuth = async () => {
      const cookieList = document.cookie.split(";");
      let jwtToken = "";
      let hasValidCookie = false;

      for (const cookie of cookieList) {
        if (cookie.startsWith("Echofyjwtsign=")) {
          try {
            jwtToken = cookie.substr(14);
            const res = await fetch("http://localhost:3001/protected", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ jwtToken: jwtToken }),
            });

            if (res.ok) {
              const result = await res.json();
              if (result.decode.userType !== "admin") {
                navigate("/");
              } else {
                hasValidCookie = true;
              }
            } else {
              navigate("/");
            }
          } catch (e) {
            console.error("Error");
          }
        }
      }

      if (!hasValidCookie) {
        navigate("/");
      }
    };
    handleAuth();
  }, []);

  const tables = [<AllUsersTable />];

  const rightButtonStyle = {
    height: "30px",
    right: "50px",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    marginRight: "250px",
  };

  const handleRightArrowClick = () => {
    setActiveTable((prevTable) => (prevTable + 1) % tables.length);
  };

  return (
    <Container fluid>
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the admin page component. 
                The admin page contains a column of navigation bar, 
                a column with title "Admin Page", the current activate table and change table button. 
            */}
      <Row>
        <Col md={3}>
          <Navbar />
        </Col>
        <Col md={6}>
          <h5 className="mt-4">Admin Page</h5>
          <div>
            {tables[activeTable]}
            <Button
              variant="outline-dark"
              style={rightButtonStyle}
              size="sm"
              onClick={handleRightArrowClick}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Admin;
