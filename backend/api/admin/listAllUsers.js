const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description Show all user's username from the database
 *
 * @component API/admin
 * @param {HTTP_Request} request
 * @param {HTTP_Response} response
 * @return null
 * @export {router} router
 */

router.get("/listAllUsers", async (request, response) => {
  // List all user records from table ACCOUNT
  const fetchAllUserQuery = `SELECT * FROM ACCOUNT ORDER BY ACCOUNT_ID ASC`;

  try {
    const client = await pool.connect();

    // Get all user records from table ACCOUNT and store them in results
    const results = await client.query(fetchAllUserQuery);

    const result = results.rows;
    // console.log(results.rows);
    response
      .status(200)
      .send({ message: `All user information fetched successfully!`, result });

    client.release();
  } catch (error) {
    console.error("An error occurred:", error);
    response
      .status(400)
      .send({ message: "An error occurred. Please try again later." });
  }
});

module.exports = router;
