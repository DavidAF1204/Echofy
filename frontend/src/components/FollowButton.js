import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
/**
 * Represents a follow button component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.username - The username of current user.
 * @param {int} props.userID - The user id of current user.
 * @param {int} props.accountID - The destinated account id of the user request to follow.
 * @returns {React.ReactElement} A follow button element.
 */

const FollowButton = ({ username, userID, accountID }) => {
  const [followButtonText, setFollowButtonText] = useState("Waiting");
  const [uname, setUname] = useState(username);
  const [uid, setUid] = useState(userID);
  const [aid, setAid] = useState(accountID);

  /**
   * send follow user request to backend. Stored the follow state data to
   * {useState} followButtonText when the request is HTTP-200
   * Targeted user potentially followed/not followed originally,
   * In case of user not followed before,
   * the button text should be set to either followed or pending corresponding to the backend response, vice versa
   *
   * @api followUser
   * @returns null.
   */
  const handleFollowClick = async () => {
    if (followButtonText === "Follow") {
      // Perform follow operation here
      const body = {
        userID: uid,
        targetID: aid,
      };

      console.log({ uid, aid });
      try {
        const result = await fetch("http://localhost:3001/followUser", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (result.ok) {
          const res = await result.json();
          if (res.message === "Successfully followed public user.") {
            setFollowButtonText("Followed");
          } else {
            setFollowButtonText("Pending");
          }
        } else {
          alert("There are some errors!");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      // Perform unfollow operation here
      const body = {
        userID: uid,
        targetID: aid,
      };

      const result = await fetch("http://localhost:3001/followUser", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (result.ok) {
        const res = await result.json();
        if (res.message === "Successfully unfollowed user.") {
          setFollowButtonText("Follow");
        }
      } else {
        alert("There are some errors!");
      }
    }
  };

  /**
   * fetch following status of user from backend. Stored the follow status data to
   * {useState} setFollowButtonText when the request is HTTP-200
   *
   * @api fetchFollowingStatus
   * @returns null.
   */
  useEffect(() => {
    const fetchfollowingStatus = async () => {
      const result = await fetch("http://localhost:3001/fetchFollowingStatus", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, userID }),
      });

      if (result.ok) {
        const res = await result.json();
        if (res.message === "Not following") {
          setFollowButtonText("Follow");
        } else if (res.message === "pending") {
          setFollowButtonText("Pending");
        } else {
          setFollowButtonText("Followed");
        }
      }
    };

    fetchfollowingStatus();
    setAid(accountID);
  }, [accountID]);

  return (
    <>
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the FollowButton component. 
                The button shows the text conveying the follow status of the particular user.
            */}
      <Button
        style={{ marginLeft: "130px" }}
        variant="outline-primary"
        size="lg"
        onClick={followButtonText === "Waiting" ? null : handleFollowClick}
      >
        {followButtonText}
      </Button>
    </>
  );
};

export default FollowButton;
