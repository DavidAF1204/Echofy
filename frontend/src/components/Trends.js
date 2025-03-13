import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

/**
 * Represents a Trends component.
 *
 * @component
 * @returns {React.ReactElement} A Trends element.
 */
function Trends() {
  const [trendingEcho, setTrendingEcho] = useState([]);

  const handleClick = (id) => {
    window.location.href = `/echo/${id}`;
  };

  /**
   * Fetching the top liked Echoes data to backend. Update the Echoes data
   * {useState} modifiedEchoedData when the request is HTTP-200
   *
   * @api recommendEcho
   * @returns null.
   */
  useEffect(() => {
    const fetchEchoes = async () => {
      try {
        const response = await fetch("http://localhost:3001/recommendEcho", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(),
        });
        if (response.ok) {
          const result = await response.json();
          const echoedData = result.object;

          const echoedDataArray = [echoedData];

          const modifiedEchoedData = echoedData.map((echo) => ({
            content: echo.content,
            LikeCount: echo["Like Count"],
            echoID: echo.echo_id,
          }));

          setTrendingEcho(modifiedEchoedData);
        }
      } catch (error) {
        console.error("Error fetching echoes:", error);
      }
    };
    fetchEchoes();
  }, []);

  return (
    <Card className="mt-4">
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the Trends component. 
                The Card contains a title Trends and the trending Echoes
            */}
      <h5 className="mt-3 ms-3 hover-cursor">Trends</h5>
      {trendingEcho.length > 0 ? (
        trendingEcho.map((trend, index) => (
          <small
            key={index}
            className="mt-2 mb-3 ms-3"
            onClick={() => handleClick(trend.echoID)}
          >
            {trend.content} {trend.LikeCount}{" "}
            {trend.LikeCount === 0 ? "0 Likes" : "Like"}
          </small>
        ))
      ) : (
        <small className="mt-2 mb-3 ms-3">No recommend Echoes</small>
      )}
    </Card>
  );
}

export default Trends;
