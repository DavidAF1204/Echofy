import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

/**
 * Represents a UsersRecommendation component.
 *
 * @component
 * @returns {React.ReactElement} A UsersRecommendation element.
 */
function UsersRecommendation() {
  const [userID, setUserID] = useState(0);
  const [recommendUsernames, setRecommendUsernames] = useState([]);

  const handleClick = (name) => {
    window.location.href = `/profile/${name}`;
  };

  /**
   * Once the component is loaded, fetch user data by token from backend.
   * Stored the data to  {useState} user id when the request is HTTP-200
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
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  /**
   * fetching the recommended users from backend.  Stored the data to
   * {useState} recommendUsernames when the request is HTTP-200
   *
   * @api userRecommendation
   * @returns null.
   */
  const fetchUserRecommendation = async () => {
    const userRecommendation = await fetch(
      "http://localhost:3001/userRecommendation",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userID: userID }),
      }
    );

    if (userRecommendation.ok) {
      const res = await userRecommendation.json();
      setRecommendUsernames(res.recommendationListByUsername);
    }
  };

  useEffect(() => {
    handleAuth();
    if (userID !== 0) {
      fetchUserRecommendation();
    }
  });

  return (
    <Card className="mt-5">
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the UsersRecommendation component. 
                The Card contains a title Users Recommendation and the list of recommend users
            */}
      <h5 className="mt-3 mb-3 ms-3">Users Recommendation</h5>
      {recommendUsernames.length !== 0 ? (
        recommendUsernames.map((user, index) => (
          <div>
            <small
              key={index}
              className="ms-3"
              onClick={() => handleClick(user)}
            >
              {user}
            </small>
            <hr />
          </div>
        ))
      ) : (
        <small className="mt-2 mb-3 ms-3">No recommend users</small>
      )}
    </Card>
  );
}

export default UsersRecommendation;
