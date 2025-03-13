const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description edit comment operation for the user
 *
 * @component API/comment
 * @param {HTTP_Request} request
 * @param {HTTP_Response} response
 * @returns null
 * @export {router} router
 */

router.post("/editComment", async (request, response) => {
  // Set the commentID and newContent from the body of HTTP request
  const { commentID, newContent } = request.body;

  // Get time when the comment is edited
  const currentDateTime = new Date();
  console.log(currentDateTime);

  // Update the CONTENT and LATEST_UPDATE_TIME based on the COMMENT_ID
  const updateCommentQuery = `
    UPDATE COMMENT
    SET CONTENT = $1, LATEST_UPDATE_TIME = $2
    WHERE COMMENT_ID = $3
  `;

  let client;
  try {
    // Connect to the PostgreSQL database using connection pooling
    client = await pool.connect();
    console.log("Connected to DB");

    // Update the CONTENT and LATEST_UPDATE_TIME based on the COMMENT_ID
    await client.query(updateCommentQuery, [
      newContent,
      currentDateTime,
      commentID,
    ]);
    response.status(200).send({ message: "Updated comment successfully!" });
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
