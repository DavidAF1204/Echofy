const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description like/unlike action for logged in user
 *
 * @component API/echo
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/likeDislikeEcho", async (req, res) => {
  // get echoID and userID from HTTP request body
  const { echoID, userID } = req.body;

  // see if the echo is exitss
  const echoQuery = "SELECT * FROM ECHO E WHERE E.ECHO_ID = $1";

  let client;
  try {
    client = await pool.connect();
    console.log("Connected to DB");

    const echoResult = await client.query(echoQuery, [echoID]);

    // see if the echo is not exists
    if (echoResult.rows.length === 0) {
      console.log("Echo does not exist");
      res.status(400).send({ message: "Echo does not exist" });
      return;
    }

    // see if the echo is suspended
    if (echoResult.rows[0].suspension_state) {
      console.log("Echo is suspended");
      res.status(400).send({ message: "Echo is suspended" });
      return;
    }

    // see if the echo is liked by the user
    const checkTypeQuery =
      "SELECT * FROM LIKE_ECHO L WHERE L.ECHO_ID = $1 AND L.LIKE_USER_ID = $2";
    const checkTypeResult = await client.query(checkTypeQuery, [
      echoID,
      userID,
    ]);

    // see if the echo is NOT liked by the user, then do like aciton
    if (checkTypeResult.rows.length === 0) {
      const insertLikeQuery =
        "INSERT INTO LIKE_ECHO (ECHO_ID, LIKE_USER_ID) VALUES ($1, $2)";
      await client.query(insertLikeQuery, [echoID, userID]);

      console.log("Successfully inserted like entity into LIKE_ECHO");
      res.status(200).send({ message: "Liked Echo successfully" });
    }
    // see if the echo is liked by the user, then do unlike aciton
    else {
      const deleteLikeQuery =
        "DELETE FROM LIKE_ECHO WHERE ECHO_ID = $1 AND LIKE_USER_ID = $2";
      await client.query(deleteLikeQuery, [echoID, userID]);

      console.log("Successfully deleted like entity from LIKE_ECHO");
      res.status(200).send({ message: "Unliked Echo successfully" });
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
