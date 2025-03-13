import React from "react";
import EchoCard from "./EchoCard";

/**
 * Represents a Echoes component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.echoes - The data of a list of echoes.
 * @returns {React.ReactElement} A list of Echo card component.
 */
function Echoes({ echoes }) {
  return (
    <div>
      {/* 
        This is a multi-line comment in JSX. 
        It provides the information about the Echoes component. 
        The div element contains EchoCards component. 
      */}
      {echoes.map((echo, index) => (
        <EchoCard key={index} echo={echo} />
      ))}
    </div>
  );
}

export default Echoes;
