import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const handleClick = (name) => {
  window.location.href = `/profile/${name}`;
};

/**
 * Represents a table containing all echoes component.
 *
 * @component
 * @returns {React.ReactElement} -table of all the echoes element.
 */
function AllUsersTable() {
  const [users, setUsers] = useState([]);

  /**
   * Once the function AllUsersTable is called, fetching all existing user data from backend. Stored the data to
   * {useState} users when the request is HTTP-200
   *
   * @api listAllUsers
   * @returns response of all users data.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // res: fetching data from listAllUser and this is the HTTP response from the fetching.
        const res = await fetch("http://localhost:3001/listAllUsers");
        console.log(res);

        // if the HTTP response state is not 200, do the following:
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        // if the HTTP response state is 200, do the following:
        const data = await res.json();
        setUsers(data.result);
        console.log(data);
        console.log(data.result);
      } catch (e) {
        console.error("Error:", e);
      }
    };

    fetchData();
  }, []);

  return (
    <Table striped bordered hover className="mt-4">
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the AllUserTable component. 
                The table contains the first row of user attributes and the table of all the users data.  
            */}
      <thead>
        <tr>
          <th>Account ID</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index} onClick={() => handleClick(user.username)}>
            <td>{user.account_id}</td>
            <td>{user.username}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default AllUsersTable;
