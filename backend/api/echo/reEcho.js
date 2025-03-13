const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description  Recho for logged in user
 *
 * @component API/echo
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/reEcho", async (req, res) => {
  // get posterID, reEchoID, content, echoImgList, echoImgTypes from the HTTP request body
  const { posterID, reEchoID, content, echoImgList, echoImgTypes } = req.body;

  // if no content and images, return message with HTTP status 400
  if (!content && echoImgList.length === 0) {
    res.status(403).send({ message: "No content" });
    console.error("No content");
    return;
  }

  let echoID;

  const fetchEchoQuery = "SELECT * FROM ECHO E WHERE E.ECHO_ID = $1";
  let client;
  try {
    client = await pool.connect();
    // console.log("Connected to DB");

    // check if the echo exists
    const fetchEchoResult = await client.query(fetchEchoQuery, [reEchoID]);
    const reEcho = fetchEchoResult.rows[0];
    if (!reEcho) return;

    // get the current time, and format it as PostgreSQL Date format
    const currentDateTime = new Date();
    const formattedDate = currentDateTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    console.log(formattedDate);

    if (content) {
      // database queries for inserting the echo and find the echoID after insertion
      const insertEchoQuery =
        "INSERT INTO ECHO (POSTER_ID, CONTENT, LATEST_UPDATE_TIME, REECHO_FLAG, REECHO_ID, SUSPENSION_STATE) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ECHO_ID";
      const insertEchoValues = [
        posterID,
        content,
        formattedDate,
        true,
        reEchoID,
        false,
      ];
      const insertedEchoResult = await client.query(
        insertEchoQuery,
        insertEchoValues
      );
      echoID = insertedEchoResult.rows[0].echo_id;
      console.log("Content posted successfully");

      if (echoImgList.length === 0) {
        res.status(200).send({ message: "Successfully post Echo" });
        return;
      }
    }

    // process base64 URL to BYTEA type for PostgreSQL
    if (echoImgList.length > 0) {
      for (let i = 0; i < echoImgList.length; i++) {
        const img = echoImgList[i];
        const imgType = echoImgTypes[i];
        const imageByteA = Buffer.from(img.split(",")[1], "base64");

        const insertImageQuery =
          "INSERT INTO ECHO_IMAGES (ECHO_ID, IMAGE, IMAGE_TYPE) VALUES ($1, $2, $3)";

        await client.query(insertImageQuery, [echoID, imageByteA, imgType]);
        console.log("Image posted successfully");
      }
    }

    res.status(200).send({ message: "Successfully post Echo" });
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
