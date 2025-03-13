import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import PostBox from './PostBox';

/** 
* Represents a logged in navigation bar component. 
* 
* @component 
* @param {Object} props - The component props. 
* @returns {React.ReactElement} A logged in navigation bar element. 
*/ 
function NavbarLoggedIn() {
  const [showPostBox, setShowPostBox] = useState(false);
  const [userID, setUserID] = useState(0);
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');

  /** 
  * Once the component is loaded, fetch user data by token from backend. 
  * Stored the data to  {useState} username, user id and user type when the request is HTTP-200 
  * 
  * @api protected 
  */
  useEffect(() => {
      const handleAuth = async () => {
        const jwtCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('Echofyjwtsign='));
        if (jwtCookie) {
          try {
            const jwtToken = jwtCookie.split('=')[1];
            const res = await fetch('http://localhost:3001/protected', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ jwtToken }),
            });
      
            if (res.ok) {
              const { decode } = await res.json();
              setUserType(decode.userType);
              setUsername(decode.username);
              setUserID(decode.userId)
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }
      };
      handleAuth();
  }, [])


  const handleProfileClick = () => {
    window.location.href = `/profile/${username}`;
  };

  const handlePostClick = () => {
    setShowPostBox(!showPostBox);
  };

  const handleLogout = () => {
    // Perform logout logic
    alert("Logged out");
    document.cookie = `Echofyjwtsign=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = '/';
  };
  
  return (
    <div>
      {/* 
            This is a multi-line comment in JSX. 
            It provides information about the NavbarLoggedIn component. 
            The Navigation bar contains the logo of Echofy ,home page icon and button,
            profile page icon and button, post button and logout button with username next to it. 
            The PostBox componenet is attached to it, show when necessary.
        */}
      <Navbar bg="light" className="flex-column align-items-start" style={{ width: '310px', position: 'fixed', top: 0, left: 0, height: '100vh' }}>
        <Navbar.Brand href="/" className="ms-5">
          <img src="/Navbar/brand.png" alt="ECHOFY" height="70" />
        </Navbar.Brand>
        <Nav className="flex-column">
          <Button variant="link" href="/">
            <img src="/Navbar/Home.png" alt="Home" height="50" />
          </Button>
          <Button variant="link" onClick={handleProfileClick}>
            <img src="/Navbar/Profile.png" alt="Profile" height="50" />
          </Button>

          <Button variant="outline-danger" size="lg" style={{ marginTop: '380px' }} className="ms-5" onClick={handlePostClick}>
            Post
          </Button>

          <div style={{ display: 'flex' }} className="mt-4 ms-5">
            <Button variant="outline-dark" className="ms-2" href="/login" onClick={handleLogout}>
              Logout
            </Button>
            <h5 id="username" className="mt-1 ms-4" onClick={handleProfileClick}>
            {username}
            </h5>
          </div>
        </Nav>
      </Navbar>

      <PostBox showPostBox={showPostBox} handlePostClick={handlePostClick} />
    </div>
  );
}

export default NavbarLoggedIn;