const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description follow/ unfollow user as the user and admin functionality
 *
 * @component API/user
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/resetPassword", async (req, res) => {
  // Set the newPassword, userID from the body of a HTTP request body
  const { newPassword, userID } = req.body;
  const resetPasswordQuery = `UPDATE ACCOUNT SET PASSWORD = $1 WHERE ACCOUNT_ID = $2`;

  // hash the new password
  const hashed = await bcrypt.hash(newPassword, 12);

  let client;
  try {
    client = await pool.connect();

    await client.query(resetPasswordQuery, [hashed, userID]);

    res.status(200).send({ message: "Password has been changed" });
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
