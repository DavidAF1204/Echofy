import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";

function FollowRequestCard(userID) {
  const [pendingUsers, setPendingUsers] = useState([]);

  /**
   * fetch pending status of user who would like to follow from backend. Stored the pending users data to
   * {useState} setPendingUsers when the request is HTTP-200
   *
   * @api fetchPendingList
   * @returns null.
   */
  const fetchFollowReuqest = async () => {
    const res = await fetch("http://localhost:3001/fetchPendingList", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userID),
    });

    if (res.ok) {
      const result = await res.json();
      const list = result.result;

      setPendingUsers(list);
    }
  };

  useEffect(() => {
    fetchFollowReuqest();
  });

  const handleClick = (name) => {
    window.location.href = `/profile/${name}`;
  };

  /**
   * change the status to follow or delete follow request from backend. Return success message when request is HTTP-200
   *
   * @api acceptFollow
   * @returns null.
   */
  const handleFollowingState = async (followerID, decision) => {
    const res = await fetch("http://localhost:3001/acceptFollow", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ followerID, userID: userID.userID, decision }),
    });

    if (res.ok) {
      const result = await res.json();
      const msg = result.message;
      alert(msg);
    } else {
      const result = await res.json();
      const msg = result.message;
      alert(msg);
    }
  };

  return (
    <Card className="mt-4">
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the FollowRequestCard component. 
                The header shows the main prupose of the FollowRequestCard.
                Based on the number of user following request, the div will be diaplyed for user to click accept follow or decline follow.
            */}
      <h5 className="mt-3 mb-4 ms-3">Users Who Requested To Follow</h5>
      {pendingUsers &&
        pendingUsers.map((user, index) => (
          <div
            key={index}
            className="d-flex justify-content-between mt-1 ms-3 me-3"
          >
            <div className="d-flex align-items-center">
              <small onClick={() => handleClick(user.name)}>{user.name}</small>
            </div>
            <div>
              <>
                <Button
                  style={{ marginTop: "20px" }}
                  variant="outline-success"
                  size="sm"
                  className="mb-3"
                  onClick={() => handleFollowingState(user.userID, "accept")}
                >
                  Accept
                </Button>
                <Button
                  style={{ marginTop: "20px" }}
                  variant="outline-danger"
                  size="sm"
                  className="mb-3 ms-2"
                  onClick={() => handleFollowingState(user.userID, "decline")}
                >
                  Deny
                </Button>
              </>
            </div>
          </div>
        ))}
    </Card>
  );
}

export default FollowRequestCard;
