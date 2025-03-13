const express = require("express");
const router = express.Router();
const pool = require("../dbconnect");

/**
 * @description show table for debug purpose
 *
 * @component API
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.get("/showTable", async (req, res) => {
  try {
    const client = await pool.connect();

    // show the table (you could change the table name)
    const selectQuery = `SELECT * FROM "USER"`;
    const selectResult = await client.query(selectQuery);
    const users = selectResult.rows;

    res.status(200).send({ users });

    client.release();
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(400)
      .send({ message: "An error occurred. Please try again later." });
  }
});

module.exports = router;
