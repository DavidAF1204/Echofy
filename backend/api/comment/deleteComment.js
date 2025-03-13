const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description delete comment operation for the user or admin
 *
 * @component API/comment
 * @param {HTTP_Request} request
 * @param {HTTP_Response} response
 * @returns null
 * @export {router} router
 */

router.post("/deleteComment", async (request, response) => {
  // get commentID from the HTTP request
  const { commentID } = request.body;

  // delete comment query
  const deleteCommentQuery = `
        DELETE FROM COMMENT
        WHERE COMMENT_ID = $1
    `;

  let client;
  try {
    client = await pool.connect();

    await client.query(deleteCommentQuery, [commentID]);
    response.status(200).send({ message: "Updated comment successfully!" });
  } catch (error) {
    console.log(error);
    response
      .status(400)
      .send({ message: "An error occurred. Please try again later." });
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = router;
