const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();
const secretKey = process.env.SIGN_KEY;
const pool = require("../../dbconnect");

/**
 * @description Login operations for admin and users
 *
 * @component API/auth
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/login", async (req, res) => {
  // get username and password from the HTTP request
  const { username, password } = req.body;

  // console.log({ username, password });

  try {
    const client = await pool.connect();
    console.log("Connected to DB");

    // get username and password from the database query
    // @param {string} username
    const accountQuery = `
      SELECT ACCOUNT_ID, USERNAME, PASSWORD
      FROM ACCOUNT
      WHERE USERNAME = $1
    `;
    const accountResult = await client.query(accountQuery, [username]);

    // returns username not found if there has no record in the database
    if (accountResult.rows.length === 0) {
      res.status(400).send({ message: "Username not found" });
      client.release();
      return;
    }

    const {
      account_id: userId,
      username: fetchedUsername,
      password: hashedPassword,
    } = accountResult.rows[0];
    let userType = "";

    // Find if userId is an admin or user here
    const adminQuery = `
      SELECT USER_TYPE
      FROM ADMIN
      WHERE ACCOUNT_ID = $1
    `;
    const adminResult = await client.query(adminQuery, [userId]);

    if (adminResult.rows.length > 0) {
      userType = "admin";
    } else {
      userType = "user";
    }

    // check if the password is correct
    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "Error comparing passwords" });
        client.release();
        return;
      }

      if (isMatch && username === fetchedUsername) {
        res.status(200);
        const token = jwt.sign(
          { username: fetchedUsername, userId: userId, userType: userType },
          secretKey
        );
        res.json({ token: token, userId: userId, userType: userType });
      } else {
        res.status(400).send({ validation: false });
      }

      client.release();
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "An error occurred. Please try again later." });
  }
});

module.exports = router;
