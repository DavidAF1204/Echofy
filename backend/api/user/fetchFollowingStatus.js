const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description edit profile for user
 *
 * @component API/user
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/fetchFollowingStatus", async (req, res) => {
  // get username (other users) and userID (the user) form the HTTP request body
  const { username, userID } = req.body;

  // get the following status from the database
  const query = `SELECT STATE
        FROM FOLLOW
        JOIN "USER" AS U1 ON FOLLOW.USER_FOLLOWING = U1.ACCOUNT_ID
        JOIN "USER" AS U2 ON FOLLOW.USER_FOLLOWER = U2.ACCOUNT_ID
        JOIN ACCOUNT AS A1 ON U1.ACCOUNT_ID = A1.ACCOUNT_ID
        JOIN ACCOUNT AS A2 ON U2.ACCOUNT_ID = A2.ACCOUNT_ID
        WHERE A1.USERNAME = $1 AND U2.ACCOUNT_ID = $2;`;

  let client;

  try {
    client = await pool.connect();

    const result = await client.query(query, [username, userID]);

    if (result.rows.length === 0) {
      res.status(200).send({ message: "Not following" });
      return;
    }

    const followingStatus = result.rows[0].state;

    res.status(200).send({ message: followingStatus });
  } catch (e) {
    console.log(error);
  } finally {
    if (client) {
      client.release();
    }
    return;
  }
});

module.exports = router;
