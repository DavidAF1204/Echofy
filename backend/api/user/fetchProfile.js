const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description fetch the profile from the database
 *
 * @component API/user
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/fetchProfile", async (req, res) => {
  // Set the userID the body of HTTP request
  const { username } = req.body;

  // fetch profile query to ask database for the record
  const fetchProfileQuery = `SELECT ACCOUNT.ACCOUNT_ID, ACCOUNT.USERNAME, ACCOUNT.EMAIL, "USER".USER_TYPE, "USER".BIRTHDAY, "USER".GENDER, "USER".COUNTRY, "USER".PUBLIC, "USER".SUSPENSION_STATE, "USER".BAN_REASON FROM ACCOUNT, "USER" WHERE ACCOUNT.ACCOUNT_ID = "USER".ACCOUNT_ID AND ACCOUNT.USERNAME = $1`;

  let client;
  try {
    client = await pool.connect();

    const { rows } = await client.query(fetchProfileQuery, [username]);

    res
      .status(200)
      .send({
        message: "Profile information fetched successfully!",
        results: rows,
      });
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
