const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description accept/ decline the pending request
 * from the user follow table for logged in user
 *
 * @component API/user
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/acceptFollow", async (req, res) => {
  // get followerID, userID, decision in the HTTP request body
  const { followerID, userID, decision } = req.body;

  // accept: change the state to following
  const acceptFollowQuery = `UPDATE FOLLOW SET STATE = 'following' WHERE USER_FOLLOWER = $1 AND USER_FOLLOWING = $2`;
  // decline: delete the pending record from the database
  const declineFollowQuery = `DELETE FROM FOLLOW WHERE USER_FOLLOWING = $1 AND USER_FOLLOWER = $2`;

  let client;
  try {
    client = await pool.connect();

    if (decision === "accept") {
      await client.query(acceptFollowQuery, [followerID, userID]);
      res.status(200).send({ message: "Accepted follow" });
    } else if (decision === "decline") {
      await client.query(declineFollowQuery, [userID, followerID]);
      res.status(200).send({ message: "Declined follow" });
    } else {
      res.status(400).send({ message: "Invalid decision" });
    }
  } catch (error) {
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
