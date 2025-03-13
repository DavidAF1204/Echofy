const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description Suspend user's ehco(es) as admin operations
 *
 * @component API/admin
 * @param {HTTP_Request} request
 * @param {HTTP_Response} response
 * @return null
 * @export {router} router
 */

router.post("/suspendEcho", async (request, response) => {
  // get userID and echoID from the @param request
  const { userID, echoID } = request.body;

  // check if the userID is admin
  const isUserAdminQuery = `SELECT ACCOUNT_ID FROM ADMIN WHERE ACCOUNT_ID = $1`;

  // change the suspension state of echo to true
  const suspendEchoQuery = `UPDATE ECHO SET SUSPENSION_STATE = TRUE WHERE ECHO_ID = $1`;

  let client;
  try {
    const client = await pool.connect();
    console.log("Connected to DB");

    const isUserAdminResult = await client.query(isUserAdminQuery, [userID]);
    const isAdmin = isUserAdminResult.rows.length === 1;

    if (isAdmin) {
      const suspendEchoResult = await client.query(suspendEchoQuery, [echoID]);
      if (suspendEchoResult.rowCount === 1) {
        response.status(200).send({ message: "Suspended Echo!" });
        return;
      } else {
        response.status(400).send({ message: "Wrong Echo_ID!" });
        return;
      }
    } else {
      console.log("You do not have permission to suspend an Echo.");
      response.status(400).send({ message: "You are not admin!" });
      return;
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
