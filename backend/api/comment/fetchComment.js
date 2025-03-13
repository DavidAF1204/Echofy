const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description get comments using echoID
 *
 * @component API/comment
 * @param {HTTP_Request} request
 * @param {HTTP_Response} response
 * @returns null
 * @export {router} router
 */

router.post("/fetchComment", async (request, response) => {
  // Set the echoID from the body of HTTP request
  const { echoID } = request.body;

  // Fetch all unsuspended comments, together with its username, content, and number of likes, ordered by its last update time
  const fetchCommentQuery = `
    SELECT
      COMMENT.COMMENT_ID,
      ACCOUNT.USERNAME,
      COMMENT.CONTENT,
      COUNT(LIKE_COMMENT.LIKE_USER_ID) AS NUMBER_OF_LIKES,
      COMMENT.LATEST_UPDATE_TIME
    FROM
      COMMENT
      JOIN ACCOUNT ON COMMENT.POSTER_ID = ACCOUNT.ACCOUNT_ID
      LEFT JOIN LIKE_COMMENT ON LIKE_COMMENT.COMMENT_ID = COMMENT.COMMENT_ID
    WHERE
      COMMENT.ECHO_ID = $1 AND
      COMMENT.SUSPENSION_STATE = FALSE
    GROUP BY
      COMMENT.COMMENT_ID,
      ACCOUNT.USERNAME,
      COMMENT.CONTENT,
      COMMENT.LATEST_UPDATE_TIME
    ORDER BY
      COMMENT.LATEST_UPDATE_TIME DESC;
  `;

  let client;
  try {
    // Connect to the PostgreSQL database using connection pooling
    client = await pool.connect();

    // Fetch all comments of an Echo with echoID together with the username of users who posted the comments
    const result = await client.query(fetchCommentQuery, [echoID]);
    const comments = result.rows.map((comment) => ({
      comment_id: comment.comment_id,
      author: comment.username,
      text: comment.content,
      number_of_likes: comment.number_of_likes,
      date: new Date(comment.latest_update_time).toISOString().split("T")[0],
    }));

    response.status(200).send({
      message: "Fetched all comments successfully!",
      results: comments,
    });
  } catch (error) {
    console.log(error);
    response
      .status(400)
      .send({ message: "An error occurred. Please try again later." });
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = router;
