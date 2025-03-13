const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description recommend user for the user
 *
 * @component API/user
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/userRecommendation", async (req, res) => {
  // Set the userID from the body of a HTTP request body
  const { userID } = req.body;

  // check the following of the following users
  // e.g. 1 -> 2 -> 3. If user 1 login, it shows the user 3 as the recommended user
  const findFollowList = `SELECT USER_FOLLOWING FROM FOLLOW WHERE USER_FOLLOWER = $1`;
  const findRecommendationListbyID = `SELECT USER_FOLLOWING FROM FOLLOW WHERE USER_FOLLOWER = ANY($1::int[])`;
  const findRecommendationListbyUsername = `SELECT USERNAME FROM ACCOUNT WHERE ACCOUNT_ID = ANY($1::int[])`;

  let client;
  try {
    client = await pool.connect();

    const followResults = await client.query(findFollowList, [userID]);
    const followingList = followResults.rows.map(
      (result) => result.user_following
    );

    const recommendationResultsByID = await client.query(
      findRecommendationListbyID,
      [followingList]
    );
    const recommendationListByID = recommendationResultsByID.rows.map(
      (result) => result.user_following
    );

    const recommendationResultsByUsername = await client.query(
      findRecommendationListbyUsername,
      [recommendationListByID]
    );
    const recommendationListByUsername =
      recommendationResultsByUsername.rows.map((result) => result.username);

    res
      .status(200)
      .send({ message: "Recommendation ready", recommendationListByUsername });
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
