const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
require("dotenv").config();
const pool = require("../../dbconnect");

/**
 * @description registration for the typical users
 *
 * @component API/auth
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/register", async (req, res) => {
  // get username, password, email, birthdaty, gender, country, isPublic from HTTP request
  const { username, password, email, birthday, gender, country, isPublic } =
    req.body;

  // hash the password and store it in database
  const hashed = await bcrypt.hash(password, 12);

  // email validation regex
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // check if it is a valid email based on the regex
  if (!validateEmail(email)) {
    res.status(400);
    res.send({ message: "Invalid email. Try again!" });
    return;
  }

  try {
    const client = await pool.connect();
    console.log("Connected to db!");

    // check if the same username has been registered
    const checkUsernameQuery = `SELECT * FROM ACCOUNT WHERE USERNAME = $1`;
    const checkUsernameResult = await client.query(checkUsernameQuery, [
      username,
    ]);

    if (checkUsernameResult.rows.length > 0) {
      res.status(400).send({ message: "Duplicated username" });
      client.release();
      return;
    }

    console.log("No duplicate username found.");

    // if no duplicated username, then add the account data to the Account table
    const insertAccountQuery = `INSERT INTO ACCOUNT (USERNAME, EMAIL, PASSWORD) VALUES ($1, $2, $3) RETURNING ACCOUNT_ID`;
    const insertAccountValues = [username, email, hashed];
    const insertAccountResult = await client.query(
      insertAccountQuery,
      insertAccountValues
    );
    const accountId = insertAccountResult.rows[0].account_id;

    console.log("Account data inserted successfully");

    // Add the account data to the "USER" table afterwards
    const insertUserQuery = `INSERT INTO "USER" (ACCOUNT_ID, USER_TYPE, BIRTHDAY, GENDER, COUNTRY, PUBLIC, SUSPENSION_STATE, BAN_REASON) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const insertUserValues = [
      accountId,
      "user",
      birthday,
      gender,
      country,
      isPublic,
      false,
      "NO",
    ];
    await client.query(insertUserQuery, insertUserValues);

    console.log("User data inserted successfully");

    res.status(200).send({ message: "Successful registration" });

    client.release();
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(400)
      .send({ message: "An error occurred. Please try again later." });
  }
});

module.exports = router;
