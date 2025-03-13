const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description delete account as admin functions
 *
 * @component API/user
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/deleteAccount", async (req, res) => {
  // get userID in the HTTP request body
  const { userID } = req.body;

  // delete all records, including echo and comments
  const deleteAllEchoQuery = `
    DELETE FROM ECHO
    WHERE POSTER_ID = $1
    AND (POSTER_ID = $1 OR REECHO_ID IN (
        SELECT ECHO_ID
        FROM ECHO
        WHERE POSTER_ID = $1
        AND REECHO_FLAG = true
    ))
    `;
  const deleteAllLikedEchoQuery = `DELETE FROM LIKE_ECHO WHERE ECHO_ID IN (SELECT ECHO_ID FROM ECHO WHERE POSTER_ID = $1) OR LIKE_USER_ID = $1`;
  const deleteAllCommentQuery = `DELETE FROM COMMENT WHERE POSTER_ID = $1`;
  const deleteAllLikedCommentQuery = `DELETE FROM LIKE_COMMENT WHERE COMMENT_ID IN (SELECT COMMENT_ID FROM COMMENT WHERE POSTER_ID = $1)`;
  const deleteAllFollowRelationQuery = `DELETE FROM FOLLOW WHERE USER_FOLLOWING = $1 OR USER_FOLLOWER = $1`;
  const deleteUserQuery = `DELETE FROM "USER" WHERE ACCOUNT_ID = $1`;
  const deleteAccountQuery = `DELETE FROM ACCOUNT WHERE ACCOUNT_ID = $1`;
  const deleteAllRelatedImagesQuery = `
    DELETE FROM ECHO_IMAGES
    WHERE ECHO_ID IN (
      SELECT ECHO_ID
      FROM ECHO
      WHERE POSTER_ID = $1
    )
  `;

  let client;
  try {
    client = await pool.connect();

    // Start a transaction
    await client.query("BEGIN");

    // Delete all liked comments
    await client.query(deleteAllLikedCommentQuery, [userID]);

    // Delete all comments
    await client.query(deleteAllCommentQuery, [userID]);

    // Delete all liked echoes
    await client.query(deleteAllLikedEchoQuery, [userID]);

    // Delete all related images
    await client.query(deleteAllRelatedImagesQuery, [userID]);

    // Delete all echoes
    await client.query(deleteAllEchoQuery, [userID]);

    // Delete all follow relations
    await client.query(deleteAllFollowRelationQuery, [userID]);

    // Delete user
    await client.query(deleteUserQuery, [userID]);

    // Delete account
    await client.query(deleteAccountQuery, [userID]);

    // Commit the transaction
    await client.query("COMMIT");

    res.status(200).send({ message: `Account ${userID} has been deleted` });
  } catch (error) {
    // Rollback the transaction in case of an error
    await client.query("ROLLBACK");

    console.error("An error occurred:", error);
    res
      .status(400)
      .send({ message: "An error occurred. Please try again later." });
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = router;
