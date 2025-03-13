const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description registration API for admin account
 *
 * @component API/auth
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 *
 * @tutorial: use POSTMAN API tools to add the admin before you start hosting
 * default admin account name is "admin"
 */

router.post("/admin_register", async (req, res) => {
  // get password from HTTP response
  const { password } = req.body;

  // set user type as admin
  const usertype = "admin";

  // hash the password in the database
  const hashed = await bcrypt.hash(password, 12);

  try {
    const client = await pool.connect();

    // insert admin info to the Account table
    const insertAccountQuery = `INSERT INTO ACCOUNT (USERNAME, EMAIL, PASSWORD) VALUES ($1, $2, $3) RETURNING ACCOUNT_ID`;
    const insertAccountValues = ["admin", "admin@echofy.com", hashed];
    const insertAccountResult = await client.query(
      insertAccountQuery,
      insertAccountValues
    );
    const accountId = insertAccountResult.rows[0].account_id;

    // console.log(accountId);

    // insert admin info to the Admin table
    const insertAdminQuery = `INSERT INTO ADMIN (ACCOUNT_ID, USER_TYPE) VALUES ($1, $2)`;
    const insertAdminValues = [accountId, usertype];
    await client.query(insertAdminQuery, insertAdminValues);

    res.status(200).send({ message: "Admin added" });

    client.release();
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(400)
      .send({ message: "An error occurred. Please try again later." });
  }
});

module.exports = router;
