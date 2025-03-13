import React from "react";
import { Table } from "react-bootstrap";
import { echoes, suspendedEchoes } from "../Data";

const handleClick = (id) => {
  window.location.href = `/echo/${id}`;
};

/**
 * Represents a SuspendedEchoesTable component.
 *
 * @component
 * @returns {React.ReactElement} A SuspendedEchoesTable element.
 */
function SuspendedEchoesTable() {
  const filteredEchoes = echoes.filter((echo) =>
    suspendedEchoes.ids.includes(echo.id)
  );

  return (
    <Table striped bordered hover className="mt-4">
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the SuspendedEchoesTable component. 
                The Table thread contains the schema in row and
                the Table body contains all the destinated echoes
            */}
      <thead>
        <tr>
          <th>Suspended Echoes</th>
          <th>Author</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {filteredEchoes.map((echo) => (
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

export default SuspendedEchoesTable;
