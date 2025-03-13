import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { echoes } from "./Data";
import Navbar from "./components/Navbar";
import EchoCard from "./components/EchoCard";
import EchoStats from "./components/EchoStats";

/**
 * Represents a Echo page component.
 *
 * @page
 * @returns {React.ReactElement} A Echo page element.
 */
function EchoPage() {
  const { id } = useParams();
  const [echo, setEcho] = useState(null);
  const [userID, setUserID] = useState(0);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");

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
          setUserType(decode.userType);
          setUsername(decode.username);
          setUserID(decode.userId);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  /**
   * fetch the targeted echo and the corresponding comments from backend.
   * Stored the data to {useState} fetchedEcho when the request is HTTP-200
   *
   * @api fetchEcho, fetchComment
   */
  const fetchEcho = async () => {
    const echoID = parseInt(id);

    const result = await fetch("http://localhost:3001/fetchEcho", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ echoID, userID }),
    });

    if (result.ok) {
      const res = await result.json();

      let images = [];
      if (Array.isArray(res.images)) {
        images = res.images.map((image) => {
          return image;
        });
      }

      const fetchedEcho = {
        text: res.content,
        images: images,
        author: res.author,
        date: res.date,
        id: res.id,
        likeCount: parseInt(res.likeCount),
        repostCount: parseInt(res.repostCount),
        comments: [],
        user_liked: res.user_liked,
      };

      // Fetch comments using the fetchComment API
      const commentResult = await fetch("http://localhost:3001/fetchComment", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ echoID, userID }),
      });

      if (commentResult.ok) {
        const commentRes = await commentResult.json();
        fetchedEcho.comments = commentRes.results;
      } else {
        const commentRes = await commentResult.json();
        console.log(commentRes.message);
      }

      setEcho(fetchedEcho);
    } else {
      const res = await result.json();
      console.log(res.message);
      return null;
    }
  };

  /* When there is a change of echo.likeCount, echo.repostCount, or echo.comments,
       <EchoCard /> and <EchoStats /> will be re-rendered with the updated echo data */
  useEffect(() => {
    handleAuth();
  });

  useEffect(() => {
    fetchEcho();
  });

  if (!echo) {
    return <div>Loading Echo!</div>;
  }

  return (
    <Container fluid>
      {/* 
              This is a multi-line comment in JSX. 
              It provides information about the Echo page component. 
              The Container contains a column of Navigation bar and a column of Echo Card and Echo Stats component.
          */}
      <Row>
        <Col md={3}>
          <Navbar />
        </Col>
        <Col md={6}>
          <EchoCard echo={echo} />
          <EchoStats
            likeCount={echo.likeCount}
            repostCount={echo.repostCount}
            comments={echo.comments}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default EchoPage;
