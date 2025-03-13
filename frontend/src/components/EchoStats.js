import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faRetweet,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Represents a Echo stat and comment component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {int} props.likeCount - The likeCount of the specific echo.
 * @param {int} props.repostCount - The repostCount of the specific echo.
 * @param {Object} props.comments - The comment of the specific echo.
 * @returns {React.ReactElement} A Echo stats and comment card element.
 */
function EchoStats({ likeCount, repostCount, comments }) {
  return (
    <Card className="mt-5">
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the EchoStats component. 
                The Card contains specific echo like count, repost count, comments and their icons. 
                Each comments' content is listed in row, with author and date information 
            */}
      <Card.Body>
        <Row>
          <Col>
            <FontAwesomeIcon icon={faHeart} /> {likeCount} Likes
          </Col>
          <Col>
            <FontAwesomeIcon icon={faRetweet} /> {repostCount} Reposts
          </Col>
          <Col>
            <FontAwesomeIcon icon={faComment} /> {comments?.length || 0}{" "}
            Comments
          </Col>
        </Row>
        {comments.length > 0 && (
          <div className="mt-3">
            <h6>Comments:</h6>
            {comments.map((comment, index) => (
              <div key={index} className="mt-3">
                {comment.text}
                <br />
                <small className="text-muted">
                  {comment.author} - {comment.date}
                </small>
                <hr />
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default EchoStats;
