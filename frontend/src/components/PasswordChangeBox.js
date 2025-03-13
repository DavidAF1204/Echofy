import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

function PasswordChangeBox({ showChangeBox, handleChangeClick, userID }) {
  const [newPassword, setNewPassword] = useState("");

  const handleChangeSubmit = async () => {
    // Perform new password submission logic here
    if (newPassword === "") {
      alert("Please enter new password!");
      return;
    }

    const data = { newPassword, userID };

    const res = await fetch("http://localhost:3001/resetPassword", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Password changed");
      setNewPassword("");
      handleChangeClick();
      return;
    } else {
      alert("Error occurs. Please try again later!");
      return;
    }
  };

  return (
    <Modal show={showChangeBox} onHide={handleChangeClick} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId="newPassword">
            <Form.Control
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-dark" onClick={handleChangeClick}>
          Cancel
        </Button>
        <Button variant="outline-danger" onClick={handleChangeSubmit}>
          Change
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PasswordChangeBox;
