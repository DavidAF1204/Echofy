const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description post echo for logged in user
 *
 * @component API/echo
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/postEcho", async (req, res) => {
  // get posterID, content, echoImgList, echoImgTypes from the HTTP request body
  const { posterID, content, echoImgList, echoImgTypes } = req.body;

  // if no content and images, return message with HTTP status 400
  if (content === "" && echoImgList.length === 0) {
    res.status(400).send({ message: "No content is found" });
    return;
  }

  // get the current time, and format it as PostgreSQL Date format
  const currentDateTime = new Date();
  const formattedDate = currentDateTime
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // set suspension state as false
  const suspensionState = false;

  // database queries for inserting the echo and find the echoID after insertion
  const insertEchoQuery = `INSERT INTO ECHO (POSTER_ID, CONTENT, LATEST_UPDATE_TIME, REECHO_FLAG, REECHO_ID, SUSPENSION_STATE) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ECHO_ID`;
  const findEchoIDQuery = `SELECT ECHO_ID FROM ECHO WHERE POSTER_ID = $1 AND CONTENT = $2 AND LATEST_UPDATE_TIME = $3`;

  const insertEchoImageQuery = `INSERT INTO ECHO_IMAGES (ECHO_ID, IMAGE, IMAGE_TYPE) VALUES ($1, $2, $3)`;

  let client;

  try {
    client = await pool.connect();
    console.log("Connected to DB");

    const echoResult = await client.query(insertEchoQuery, [
      posterID,
      content,
      formattedDate,
      false,
      0,
      suspensionState,
    ]);
    console.log("Echo posted successfully");

    const newechoID = await client.query(findEchoIDQuery, [
      posterID,
      content,
      formattedDate,
    ]);
    const echoID = newechoID.rows[0].echo_id;

    // process base64 URL to BYTEA type for PostgreSQL
    if (echoImgList.length > 0) {
      for (let i = 0; i < echoImgList.length; i++) {
        const img = echoImgList[i];
        const imgType = echoImgTypes[i];
        const imageByteA = Buffer.from(img.split(",")[1], "base64"); // Convert base64 to BYTEA

        await client.query(insertEchoImageQuery, [echoID, imageByteA, imgType]);
        console.log("Image posted successfully");
      }
    }

    res.status(200).send({ message: "Successfully Post Echo!" });
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
