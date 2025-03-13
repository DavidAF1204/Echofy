import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

/**
 * Fetching target user information by username from backend.
 * Directs to the profile page of the target user when the request is HTTP-200.
 *
 * @api searchUser
 * @param {string} name - the target username.
 * @returns null.
 */
const handleSearch = async (name) => {
  console.log(name);
  const searchUser = await fetch("http://localhost:3001/searchUser", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ username_query: name }),
  });

  if (searchUser.ok) {
    const result = await searchUser.json();

    if (result.searchResultsList.length > 0) {
      const username = result.searchResultsList[0].username;
      window.location.href = `/profile/${username}`;
    } else {
      alert("No matching users");
    }
  }
};

function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <Form className="d-flex mt-4" onSubmit={handleSubmit}>
      {/* 
          This is a multi-line comment in JSX. 
          It provides information about the Search component. 
          The Form component contains a placeholder to input target username and
          a search button for submitting username of the target user
        */}
      <Form.Control
        type="search"
        placeholder="Search"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <Button variant="outline-dark" className="ms-4" type="submit">
        Search
      </Button>
    </Form>
  );
}

export default Search;
