const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description Suspend user's comments(e) as admin operations
 *
 * @component API/admin
 * @param {HTTP_Request} request
 * @param {HTTP_Response} response
 * @returns null
 * @export {router} router
 */

router.post("/suspendComment", async (request, response) => {
  // Set the userID and commentID from the body of a request (input)
  const { userID, commentID } = request.body;

  // Get the ACCOUNT_ID which is the same as the inputted userID
  const isUserAdminQuery = `SELECT ACCOUNT_ID FROM ADMIN WHERE ACCOUNT_ID = $1`;

  // If COMMENT_ID is the inputted commentID, change its SUSPENSION_STATE to TRUE in table COMMENT
  const suspendCommentQuery = `UPDATE COMMENT SET SUSPENSION_STATE = TRUE WHERE COMMENT_ID = $1`;

  let client;

  try {
    const client = await pool.connect();
    console.log("Connected to DB");

    // Check if this userID belongs to one of the admins
    const adminCheckResult = await client.query(isUserAdminQuery, [userID]);

    // If this userID belongs to an Admin, i.e. has one record in table ADMIN
    if (adminCheckResult.rows.length === 1) {
      // Suspend the comment by updating its SUSPENSION_STATE to TRUE
      await client.query(suspendCommentQuery, [commentID]);

      response.status(200).send({ message: "Suspended Comment!" });
    } else {
      console.log("You do not have permission to suspend a comment.");
      response.status(400).send({ message: "You are not an admin!" });
    }

    client.release();
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
