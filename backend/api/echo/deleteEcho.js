const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description delete comment operation for the user
 *
 * @component API/echo
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/deleteEcho", async (req, res) => {
  // get echoID and userID form the HTTP request body
  const { echoID, userID } = req.body;

  // check if the user is the poster of the echo with the userID
  const matchQuery = `
      SELECT * FROM ECHO E
      JOIN ACCOUNT A ON E.POSTER_ID = A.ACCOUNT_ID
      WHERE E.ECHO_ID = $1 AND E.POSTER_ID = $2 AND A.ACCOUNT_ID = $3
    `;
  let client;
  try {
    client = await pool.connect();
    console.log("Connected to DB");

    const matchResult = await client.query(matchQuery, [
      echoID,
      userID,
      userID,
    ]);

    if (matchResult.rows.length === 0) {
      res.status(400).send({ message: "No matching Echo" });
      return;
    }

    /**
     * Delete operations wtih the corresponding tables
     * Incl. LIKE_COMMENT, COMMENT, LIKE_ECHO, ECHO_IMAGES, ECHO
     */

    await client.query("DELETE FROM LIKE_COMMENT WHERE ECHO_ID = $1", [echoID]);
    await client.query("DELETE FROM COMMENT WHERE ECHO_ID = $1", [echoID]);
    await client.query("DELETE FROM LIKE_ECHO WHERE ECHO_ID = $1", [echoID]);
    await client.query("DELETE FROM ECHO_IMAGES WHERE ECHO_ID = $1", [echoID]);
    await client.query("DELETE FROM ECHO WHERE ECHO_ID = $1", [echoID]);

    res.status(200).send({ message: "Deleted Echo" });
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
