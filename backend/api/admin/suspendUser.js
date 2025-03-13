const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description Suspend user(s) as admin operations
 *
 * @component API/admin
 * @param {HTTP_Request} request
 * @param {HTTP_Response} response
 * @return null
 * @export {router} router
 */

router.get("/suspendUser", async (request, response) => {
  // Set userID and banReason as the body of a request (input)
  const { userID, banReason } = request.body;

  // Update the USER table to suspend the user
  const suspendUserQuery = `UPDATE "USER" SET SUSPENSION_STATE = TRUE, BAN_REASON = $1 WHERE ACCOUNT_ID = $2`;

  let client;
  try {
    client = await pool.connect();

    // Update the user record in the USER table
    await client.query(suspendUserQuery, [banReason, userID]);

    // TODO: Suspend Echoes and comments posted by this user
    // const ...

    response.status(200).send({ message: "User is banned successfully!" });
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
