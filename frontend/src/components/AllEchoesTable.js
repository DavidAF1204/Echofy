import React from "react";
import { Table } from "react-bootstrap";
import { echoes } from "../Data";

/**
 * Represents a table containing all echoes component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {React.ReactElement} -table of all the echoes element.
 */

const handleClick = (id) => {
  window.location.href = `/echo/${id}`;
};

function AllEchoesTable() {
  return (
    <Table striped bordered hover className="mt-4">
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the AllEchoesTable component. 
                The table contains the first row of echo attributes and the table of all the echoes data.  
            */}
      <thead>
        <tr>
          <th>All Echoes</th>
          <th>Author</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {echoes.map((echo) => (
          <tr key={echo.id} onClick={() => handleClick(echo.id)}>
            <td style={{ wordBreak: "break-word" }}>{echo.text}</td>
            <td>{echo.author}</td>
            <td>{echo.date}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default AllEchoesTable;
