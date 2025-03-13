import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./components/Navbar";
import Echoes from "./components/Echoes";
import { useNavigate } from "react-router-dom";
import FollowButton from "./components/FollowButton";
import FollowRequestCard from "./components/FollowRequestCard";
import PasswordChangeBox from "./components/PasswordChangeBox";

/**
 * Represents a profile page.
 *
 * @page
 * @param {Object} props - The page props.
 * @returns {React.ReactElement} A profile element.
 */
function Profile() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [userID, setUserID] = useState(0);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");

  const [profileData, setProfileData] = useState({
    accountID: 0,
    username: "",
    email: "",
    birthday: "",
    gender: "",
    country: "",
    public: "",
  });

  /**
   * Once the page is loaded, fetch user data by token from backend.
   * Stored the data to  {useState} username, user id and user type when the request is HTTP-200
   *
   * @api protected
   * @returns null.
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
   * fetch specific user profile data from backend.
   * Stored the data to  {useState} profile data when the request is HTTP-200
   *
   * @api fetchProfile
   * @returns null.
   */
  const getProfileData = async () => {
    try {
      const res = await fetch("http://localhost:3001/fetchProfile", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username: name }),
      });

      if (res.ok) {
        const result = await res.json();
        const profile = result.results[0];

        // Date formatting
        const profileBirthday = new Date(profile.birthday);
        const year = profileBirthday.getFullYear();
        const month = (profileBirthday.getMonth() + 1)
          .toString()
          .padStart(2, "0"); // Month is zero-based, so add 1
        const day = profileBirthday.getDate().toString().padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        setProfileData({
          accountID: profile.account_id,
          username: profile.username,
          email: profile.email,
          birthday: formattedDate,
          gender: profile.gender,
          country: profile.country,
          public: profile.public ? "Public" : "Private",
        });
      } else {
        alert("Cannot fetch profile");
      }
    } catch (e) {
      console.error("Error");
    }
  };

  useEffect(() => {
    handleAuth();
    getProfileData();
  }, [profileData.accountID, userID, profileData.username]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData({ ...profileData, [name]: value });
  };

  /**
   * Edit the user information in backend.
   * Navigate to profile page of the user with new username and
   * update the token with the response when the request is HTTP-200
   *
   * @api editProfile
   * @param {Event} e -The event object from the save form submission.
   * @returns null.
   */
  const handleSave = async (e) => {
    // Perform save operation here, modify users with updated profileData
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      newUsername: formData.get("username"),
      newEmail: formData.get("email"),
      newBirthday: formData.get("birthday"),
      newGender: formData.get("gender"),
      newCountry: formData.get("country"),
      isPublic: formData.get("public") === "Public" ? true : false,
      userID: userID,
    };

    const editProfile = await fetch("http://localhost:3001/editProfile", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (editProfile.ok) {
      const res = await editProfile.json();
      document.cookie = `Echofyjwtsign=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      // console.log(res.token.length)
      document.cookie = `Echofyjwtsign=${res.token}; path:/`;
      alert("Profile saved");
      navigate(`/profile/${data.newUsername}`);
      return;
    } else {
      const res = await editProfile.json();
      alert(res.message);
      return;
    }
  };

  /**
   * This is admin only function,
   * delete the specific account data from backend.
   * Navigate back to home page when the request is HTTP-200
   *
   * @api deleteAccount
   * @returns null.
   */
  const handleDelete = async () => {
    const deleteUser = await fetch("http://localhost:3001/deleteAccount", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userID: profileData.accountID }),
    });
    console.log("Del id", profileData.accountID);
    if (deleteUser.ok) {
      const res = await deleteUser.json();
      alert(res.message);
      navigate("/");
      return;
    } else {
      const res = await deleteUser.json();
      alert(res.message);
      return;
    }
  };

  const [activeCard, setActiveCard] = useState(0);

  const cards = [<FollowRequestCard userID={userID}></FollowRequestCard>];

  const rightButtonStyle = {
    height: "30px",
    right: "50px",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    marginRight: "30px",
  };

  const handleRightArrowClick = () => {
    setActiveCard((prevCard) => (prevCard + 1) % cards.length);
  };

  const [showChangeBox, setShowChangeBox] = useState(false);

  const handleChangeClick = () => {
    setShowChangeBox(!showChangeBox);
  };

  return (
    <Container fluid>
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the profile page. 
                The Container a row of elements in column
                the first column includes the navigation bar, 
                the second column includes card component with form inside displaying the user informations.
                the third column includes a current active card
            */}
      <Row>
        <Col md={3}>
          <Navbar />
        </Col>
        <Col md={4}>
          <div className="d-flex align-items-center vh-100">
            <Card style={{ width: "400px" }}>
              <Card.Body>
                <Card.Title className="text-center">Profile</Card.Title>
                <Form onSubmit={handleSave}>
                  <Form.Group controlId="name" className="mt-4">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={name === username ? handleInputChange : null}
                    />
                  </Form.Group>

                  <Form.Group controlId="email" className="mt-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={name === username ? handleInputChange : null}
                    />
                  </Form.Group>

                  <Form.Group controlId="birthday" className="mt-4">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthday"
                      value={profileData.birthday}
                      onChange={name === username ? handleInputChange : null}
                    />
                  </Form.Group>

                  <Form.Group controlId="gender" className="mt-4">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      as="select"
                      name="gender"
                      value={profileData.gender}
                      onChange={name === username ? handleInputChange : null}
                    >
                      <option>Other</option>
                      <option>Male</option>
                      <option>Female</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="country" className="mt-4">
                    <Form.Label>Country/Region</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      value={profileData.country}
                      onChange={name === username ? handleInputChange : null}
                    />
                  </Form.Group>

                  <Form.Group controlId="type" className="mt-4">
                    <Form.Label>Account Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="public"
                      value={profileData.public}
                      onChange={name === username ? handleInputChange : null}
                    >
                      <option>Public</option>
                      <option>Private</option>
                    </Form.Control>
                  </Form.Group>

                  {/* If Profile Page is displaying the profile of the logged in user, display Save Button.
                                         If not but if the logged in user is an admin, s/he can suspend other users in their Profile Pages */}
                  {name === username ? (
                    <div className="d-grid mt-4">
                      <Button variant="dark" size="lg" onClick={handleSave}>
                        Save
                      </Button>
                      <a
                        className="text-center mt-4"
                        onClick={handleChangeClick}
                      >
                        Change Password
                      </a>
                      <PasswordChangeBox
                        showChangeBox={showChangeBox}
                        handleChangeClick={handleChangeClick}
                        userID={userID}
                      />
                    </div>
                  ) : username && userType === "admin" ? (
                    <div className="mt-4">
                      <Button
                        className="ms-5"
                        variant="danger"
                        size="lg"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                      <div className="mt-4"></div>
                    </div>
                  ) : username && userType === "user" ? (
                    <div className="mt-4">
                      <FollowButton
                        username={profileData.username}
                        userID={userID}
                        accountID={profileData.accountID}
                      ></FollowButton>
                    </div>
                  ) : null}
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Col>
        {username === name ? (
          <Col md={4}>
            <div>{cards[activeCard]}</div>
          </Col>
        ) : null}
      </Row>
    </Container>
  );
}

export default Profile;
