import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody } from "react-bootstrap";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import Echoes from "./components/Echoes";
import Trends from "./components/Trends";
import UsersRecommendation from "./components/UsersRecommendation";

/**
 * Represents a Home page bar component.
 *
 * @page
 * @param {Object} props - The component props.
 * @returns {React.ReactElement} A home page element.
 */
function Home() {
  const [userID, setUserID] = useState(0);
  const [userType, setUserType] = useState("");
  const [echo, setEcho] = useState([]);

  /**
   * fetch user data by token from backend.
   * Stored the data to  {useState} username, user id and user type when the request is HTTP-200
   *
   * @api protected
   */
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
          setUserID(decode.userId);
          setUserType(decode.userType);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  /**
   * Once the component is loaded, fetch all echoes of users followings from backend.
   * Stored the data to  {useState} mappedEchoes when the request is HTTP-200
   *
   * @api fetchAllFollowingEcho
   * @param null.
   * @returns null.
   */
  const fetchAllFollowingEchoes = async () => {
    const result = await fetch("http://localhost:3001/fetchAllFollowingEcho", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userID }),
    });

    if (result.ok) {
      const res = await result.json();

      const mappedEchoes = res.result.map((item) => {
        let images = [];
        if (Array.isArray(item.images)) {
          images = item.images.map((image) => {
            return image;
          });
        }

        return {
          text: item.content,
          images: images,
          author: item.author,
          date: item.date,
          id: item.id,
          likeCount: parseInt(item.num_likes),
          repostCount: parseInt(item.num_reechos),
          comments: [],
          user_liked: item.user_liked,
        };
      });

      setEcho(mappedEchoes);
      return;
    } else {
      const res = await result.json();
      console.log(res.message);
    }
  };

  /**
   * Once the component is loaded, fetch all publbic echoes from backend.
   * Stored the data to  {useState} mappedEchoes when the request is HTTP-200
   *
   * @api fetchPublicEcho
   * @param null.
   * @returns null.
   */
  const fetchAllPublicEchoes = async () => {
    const result = await fetch("http://localhost:3001/fetchPublicEcho", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (result.ok) {
      const res = await result.json();

      const mappedEchoes = res.result.map((item) => {
        let images = [];
        if (Array.isArray(item.images)) {
          images = item.images.map((image) => {
            return image;
          });
        }

        return {
          text: item.content,
          images: images,
          author: item.author,
          date: item.date,
          id: item.id,
          likeCount: parseInt(item.num_likes),
          repostCount: parseInt(item.num_reechos),
          comments: [],
        };
      });

      setEcho(mappedEchoes);
      return;
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  useEffect(() => {
    fetchAllFollowingEchoes();
  });

  return (
    <Container fluid>
      {/* 
        This is a multi-line comment in JSX. 
        It provides information about the home page component. 
        The Container a row of elements in column the first column includes the navigation bar, 
        the second column includes search component, card component contains echoes.
        the third column includes a Trend component and User Recommendation component
      */}
      <Row>
        <Col md={3}>
          <Navbar />
        </Col>
        <Col md={6}>
          <Search />
          {echo.length !== 0 ? (
            <Echoes echoes={echo} />
          ) : (
            <Card className="mt-5">
              <CardBody>
                <p>No Echoes right now! </p>
                <p>
                  <span
                    style={{ color: "blueviolet" }}
                    onClick={
                      userType === "user"
                        ? fetchAllFollowingEchoes
                        : fetchAllPublicEchoes
                    }
                  >
                    Click Here
                  </span>{" "}
                  to reload.
                </p>
              </CardBody>
            </Card>
          )}
        </Col>
        <Col md={3}>
          <Trends />
          {userType === "user" ? <UsersRecommendation /> : null}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
