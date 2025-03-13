const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description like or unlike comment operation for the user
 *
 * @component API/comment
 * @param {HTTP_Request} request
 * @param {HTTP_Response} response
 * @returns null
 * @export {router} router
 */

router.post("/likeUnlikeComment", async (request, response) => {
  // Set commentID and userID from the body of HTTP request
  const { commentID, userID } = request.body;

  // Add a like record with userID and commentID in the LIKE_COMMENT table
  const likeCommentQuery = `INSERT INTO LIKE_COMMENT (LIKE_USER_ID, COMMENT_ID) VALUES ($1, $2)`;
  // Search if the user liked the same comment before, i.e. relevant like record exists in LIKE_COMMENT
  const searchUserLike = `SELECT LIKE_USER_ID, COMMENT_ID FROM LIKE_COMMENT WHERE LIKE_USER_ID = $1 AND COMMENT_ID = $2`;
  // Remove the like record from the LIKE_COMMENT table
  const unlikeCommentQuery = `DELETE FROM LIKE_COMMENT WHERE LIKE_USER_ID = $1 AND COMMENT_ID = $2`;

  let client;
  try {
    client = await pool.connect();
    console.log("Connected to DB");

    // Search if the user with userID liked the comment with commentID before
    const searchResult = await client.query(searchUserLike, [
      userID,
      commentID,
    ]);

    if (searchResult.rows.length === 1) {
      // If the user has liked the comment before, unlike
      await client.query(unlikeCommentQuery, [userID, commentID]);
      response.status(200).send({ message: "Unliked comment successfully!" });
    } else {
      // Like, i.e. insert like record
      await client.query(likeCommentQuery, [userID, commentID]);
      response.status(200).send({ message: "Liked comment successfully!" });
    }
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
