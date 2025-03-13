const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description edit comment operation for the user
 *
 * @component API/echo
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/editEcho", async (req, res) => {
  // get echoID and content (new content) from the HTTP resquest body
  const { echoID, content } = req.body;

  // check if the echo exitst using echoID, also to check if the content is the same
  const matchQuery = "SELECT * FROM ECHO E WHERE E.ECHO_ID = $1";
  let client;

  try {
    client = await pool.connect();
    console.log("Connected to DB");

    const matchResult = await client.query(matchQuery, [echoID]);

    // check if the echo exitst using echoID
    if (matchResult.rows.length === 0) {
      res.status(400).send({ message: "Echo does not exist" });
      return;
    }

    // check if the content is the same
    if (matchResult.rows[0].content === content) {
      res.status(400).send({ message: "Same content" });
      return;
    }

    // get the current time, and format it as PostgreSQL Date format
    const currentDateTime = new Date();
    const formattedDate = currentDateTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    console.log(formattedDate);

    // update comment query
    const updateQuery =
      "UPDATE ECHO SET CONTENT = $1, LATEST_UPDATE_TIME = $2 WHERE ECHO_ID = $3";
    await client.query(updateQuery, [content, currentDateTime, echoID]);

    res.status(200).send({ message: "Content updated" });
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
