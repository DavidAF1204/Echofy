const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description show TOP 3 liked Echo as recommand Echoes for all users and viewers
 *
 * @component API/echo
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/recommendEcho", async (req, res) => {
  // recommend echo query
  const recommendEchoQuery = `
    SELECT E.ECHO_ID, COUNT(L.ECHO_ID) AS "Like Count", E.CONTENT, E.POSTER_ID
    FROM ECHO E
    JOIN LIKE_ECHO L ON E.ECHO_ID = L.ECHO_ID
    JOIN "USER" U ON E.POSTER_ID = U.ACCOUNT_ID
    WHERE U.PUBLIC = TRUE
    GROUP BY E.ECHO_ID
    ORDER BY COUNT(L.ECHO_ID) DESC
    LIMIT 3;
  `;

  let client;
  try {
    client = await pool.connect();
    console.log("Connected to DB");

    const recommendEchoResult = await client.query(recommendEchoQuery);
    const result = recommendEchoResult.rows;

    if (result.length === 1) {
      const object = result[0];
      res.status(200).send({ object });
      return;
    } else if (result.length === 2) {
      const object = [result[0], result[1]];
      res.status(200).send({ object });
      return;
    } else if (result.length >= 3) {
      const object = [result[0], result[1], result[2]];
      res.status(200).send({ object });
      return;
    }

    res.status(200).send({ message: "No suggestions" });
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
