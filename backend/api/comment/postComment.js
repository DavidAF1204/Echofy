const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description post comment operation for the user
 *
 * @component API/comment
 * @param {HTTP_Request} request
 * @param {HTTP_Response} response
 * @returns null
 * @export {router} router
 */

router.post("/postComment", async (request, response) => {
  // Set the echoID, posterID, and content from the body of HTTP request
  const { echoID, posterID, content } = request.body;

  // Get the time when the comment is posted
  const currentDateTime = new Date();
  const formattedDate = currentDateTime
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // Initially, the suspensionState of a comment is false, i.e. not suspended
  const suspensionState = false;

  // Insert a comment record with the ECHO_ID of the commented Echo, the user who commented, its content, the last update time, and the suspension state into the COMMENT table
  const postCommentQuery = `INSERT INTO COMMENT (ECHO_ID, POSTER_ID, CONTENT, LATEST_UPDATE_TIME, SUSPENSION_STATE) 
    VALUES ($1, $2, $3, $4, $5)`;

  let client;

  try {
    client = await pool.connect();
    console.log("Connected to DB");

    // Insert a comment record with the ECHO_ID of the commented Echo, the user who commented, its content, the last update time, and the suspension state into the COMMENT table
    await client.query(postCommentQuery, [
      echoID,
      posterID,
      content,
      formattedDate,
      suspensionState,
    ]);
    response.status(200).send({ message: "Comment posted successfully!" });
  } catch (error) {
    console.error("An error occurred:", error);
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
