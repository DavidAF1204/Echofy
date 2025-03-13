const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description search the user
 *
 * @component API/user
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/searchUser", async (req, res) => {
  // Set the username_query from the body of a HTTP request body
  const { username_query } = req.body;
  const searchKeyword = username_query;

  // search user query, check if the user is exists and not suspended
  const findUsernameQuery = `
    SELECT a.USERNAME
    FROM "USER" u
    JOIN ACCOUNT a ON u.ACCOUNT_ID = a.ACCOUNT_ID
    WHERE u.SUSPENSION_STATE = false
      AND a.USERNAME = $1`;

  let client;
  try {
    client = await pool.connect();

    const { rows: searchResults } = await client.query(findUsernameQuery, [
      searchKeyword,
    ]);

    const searchResultsList = searchResults.map((result) => result);

    res.status(200).send({ message: "Search result ready", searchResultsList });
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
