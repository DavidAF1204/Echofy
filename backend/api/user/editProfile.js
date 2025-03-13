const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SIGN_KEY;
require("dotenv").config();

/**
 * @description edit profile for user
 *
 * @component API/user
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/editProfile", async (req, res) => {
  // get new username, email address, date of birth,
  // gender, country, public/private setting, and userID as the HTTP request body
  const {
    newUsername,
    newEmail,
    newBirthday,
    newGender,
    newCountry,
    isPublic,
    userID,
  } = req.body;

  const editAccountProfileQuery = `UPDATE ACCOUNT
                                   SET USERNAME = $1, EMAIL = $2
                                   WHERE ACCOUNT_ID = $3`;

  const editUserProfileQuery = `UPDATE "USER"
                                SET BIRTHDAY = $1, GENDER = $2, COUNTRY = $3, PUBLIC = $4
                                WHERE ACCOUNT_ID = $5`;

  let client;
  try {
    client = await pool.connect();

    // Start a transaction
    await client.query("BEGIN");

    // Update table ACCOUNT
    await client.query(editAccountProfileQuery, [
      newUsername,
      newEmail,
      userID,
    ]);

    // Update table USER
    await client.query(editUserProfileQuery, [
      newBirthday,
      newGender,
      newCountry,
      isPublic,
      userID,
    ]);

    // Commit the transaction
    await client.query("COMMIT");

    const token = jwt.sign(
      { username: newUsername, userId: userID, userType: "user" },
      secretKey
    );

    res
      .status(200)
      .send({
        message: "Profile information has been updated successfully!",
        token,
      });
  } catch (error) {
    // Rollback the transaction in case of an error
    await client.query("ROLLBACK");

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
