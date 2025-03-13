import React from "react";
import { Table } from "react-bootstrap";
import { suspendedUsers } from "../Data";

const handleClick = (name) => {
  window.location.href = `/profile/${name}`;
};

/**
 * Represents a SuspendedUsersTable component.
 *
 * @component
 * @returns {React.ReactElement} A SuspendedUsersTable element.
 */
function SuspendedUsersTable() {
  return (
    <Table striped bordered hover className="mt-4">
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the SuspendedUsersTable component. 
                The Table thread contains the schema in row and
                the Table body contains all the destinated users
            */}
      <thead>
        <tr>
          <th>Suspended Users</th>
        </tr>
      </thead>
      <tbody>
        {suspendedUsers.names.map((name, index) => (
          <tr key={index} onClick={() => handleClick(name)}>
            <td>{name}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default SuspendedUsersTable;
