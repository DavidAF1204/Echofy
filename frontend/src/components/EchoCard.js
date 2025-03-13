import React, { useEffect, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faRetweet,
  faComment,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import ReEchoBox from "./ReEchoBox";

/**
 * Represents a Echo card component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.echo - The desinated echo object with corresponding attributes.
 * @returns {React.ReactElement} A echo card element.
 */
function EchoCard({ echo }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRepostBox, setShowRepostBox] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [userID, setUserID] = useState(0);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [liked, setliked] = useState(echo.user_liked);

  /**
   * Fetching user data from backend. Stored the data to
   * {useState} userId, userName, userType, liked when the request is HTTP-200
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
          setliked(echo.user_liked);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    handleAuth();
  });

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + echo.images.length) % echo.images.length
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % echo.images.length);
  };

  const handleRepostClick = () => {
    setShowRepostBox(!showRepostBox);
  };

  const handleCommentClick = () => {
    setShowCommentBox(!showCommentBox);
  };

  /**
   * Submit comment to backend.
   * Comment received when the requets if HTTP-200
   *
   * @api postComment
   * @returns null.
   */
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (comment === "" || comment === null) {
      alert("No content. Please type text for comments.");
      return;
    }

    const res = await fetch("http://localhost:3001/postComment", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        posterID: userID,
        echoID: echo.id,
        content: comment,
      }),
    });

    if (res.ok) {
      setComment("");
      setShowCommentBox(false);
      alert("Send comment successfully");
    } else {
      alert("Fail to comment");
    }
  };

  const handleViewEcho = (id) => {
    console.log(id);
    window.location.href = `/echo/${id}`;
  };

  const handleAuthorClick = (author) => {
    window.location.href = `/profile/${author}`;
  };

  const handleSuspend = () => {
    // Perform suspend operation here
    alert("Echo suspended");
  };

  /**
   * Changing the echo like data from backend. Stored the data to
   * {useState} liked when the request is HTTP-200
   *
   * @api likeDislikeEcho
   * @returns null.
   */
  const handleLike = async () => {
    if (userID === 0) return;
    const likePressed = await fetch("http://localhost:3001/likeDislikeEcho", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userID: userID,
        echoID: echo.id,
      }),
    });
    const res = await likePressed.json();
    const message = res.message;
    var text1 = "Liked Echo successfully";
    var text2 = "Unliked Echo successfully";
    if (likePressed.ok) {
      if (message === text1) setliked(true);
      else if (message === text2) setliked(false);
    } else {
      console.log(message, userID);
    }
  };

  const leftButtonStyle = {
    height: "30px",
    left: "50px",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
  };

  const rightButtonStyle = {
    height: "30px",
    right: "50px",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
  };

  return (
    <Card className="mt-5">
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the Echo Card component. 
                The card body contains a echo text, image,
                the card footer contains echo like button, repost button,
                post comment button, view echo button 
                The External component ReEchoBox and Comment Box are also within this card       
            */}
      <Card.Body>
        <Card.Text>{echo.text}</Card.Text>
        {echo.images && (
          <div>
            <div className="d-flex justify-content-center position-relative">
              {currentImageIndex > 0 && (
                <Button
                  className="position-absolute"
                  variant="outline-dark"
                  style={leftButtonStyle}
                  size="sm"
                  onClick={handlePrevImage}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
              )}
              <Card.Img
                style={{ width: "200px", height: "auto" }}
                src={echo.images[currentImageIndex]}
              />
              {currentImageIndex < echo.images.length - 1 && (
                <Button
                  className="position-absolute"
                  variant="outline-dark"
                  style={rightButtonStyle}
                  size="sm"
                  onClick={handleNextImage}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              )}
            </div>
            {echo.images.length !== 0 && (
              <div className="text-center mt-3">
                {currentImageIndex + 1}/{echo.images.length}
              </div>
            )}
          </div>
        )}
      </Card.Body>

      <Card.Footer>
        {username !== "" && userType === "user" ? (
          <Button
            variant="outline-danger"
            size="sm"
            className="me-4"
            onClick={handleLike}
          >
            <FontAwesomeIcon icon={faHeart} /> {liked ? "Liked" : "Like"}
          </Button>
        ) : null}
        {username !== "" && userType === "user" ? (
          <Button
            variant="outline-dark"
            size="sm"
            className="me-4"
            onClick={handleRepostClick}
          >
            <FontAwesomeIcon icon={faRetweet} /> ReEcho
          </Button>
        ) : null}
        {username !== "" && userType === "user" ? (
          <Button
            variant="outline-dark"
            size="sm"
            className="me-4"
            onClick={handleCommentClick}
          >
            <FontAwesomeIcon icon={faComment} /> Comment
          </Button>
        ) : null}
        {!window.location.pathname.startsWith("/echo/") ? (
          <Button
            variant="outline-dark"
            size="sm"
            className="me-4"
            onClick={() => handleViewEcho(echo.id)}
          >
            View Echo
          </Button>
        ) : null}
        {/* {username !== '' && userType === "admin" ? (
                    <Button variant="danger" size="sm" className="me-4" onClick={handleSuspend}>
                        Suspend
                    </Button>
                ) : null} */}
        <small
          className="text-muted"
          onClick={() => handleAuthorClick(echo.author)}
        >
          {echo.author} · {echo.date}
        </small>
      </Card.Footer>

      <ReEchoBox
        showPostBox={showRepostBox}
        handlePostClick={handleRepostClick}
        reechoID={echo.id}
      />

      {showCommentBox && (
        <Card.Body>
          <Form onSubmit={handleCommentSubmit}>
            <Form.Group controlId="commentInput">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write a comment..."
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="outline-dark"
              size="sm"
              type="submit"
              className="mt-3"
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
      )}
    </Card>
  );
}

export default EchoCard;
