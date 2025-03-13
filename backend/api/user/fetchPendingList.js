const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description fetch the pending request
 * from the user follow table for logged in user
 *
 * @component API/user
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/fetchPendingList", async (req, res) => {
  // get userID from the HTTP request body
  const { userID } = req.body;

  // get the list of usernames and the corresponding accont_id from the database
  const query = `
        SELECT A.USERNAME AS FOLLOWING_USERNAME, A.ACCOUNT_ID
        FROM FOLLOW AS F
        JOIN "USER" AS U1 ON F.USER_FOLLOWER = U1.ACCOUNT_ID
        JOIN ACCOUNT AS A ON U1.ACCOUNT_ID = A.ACCOUNT_ID
        WHERE F.USER_FOLLOWING = $1 AND F.STATE = 'pending';
    `;

  let client;
  try {
    client = await pool.connect();

    const { rows } = await client.query(query, [userID]);

    if (rows.length === 0) {
      res.status(200).send({ message: "No pending requests!" });
      return;
    }

    const result = rows.map((item) => {
      return {
        name: item.following_username,
        userID: item.account_id,
      };
    });

    res.status(200).send({ result });
  } catch (e) {
    console.log(e);
  } finally {
    if (client) {
      client.release();
    }
    return;
  }
});

module.exports = router;
