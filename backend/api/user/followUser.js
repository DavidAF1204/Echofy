const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description follow/ unfollow user as the user functionality
 *
 * @component API/user
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/followUser", async (req, res) => {
  // Set the userID, targetID from the body of a HTTP request body
  const { userID, targetID } = req.body;

  const checkFollowingQuery = `SELECT EXISTS(SELECT 1 FROM FOLLOW WHERE USER_FOLLOWING = $1 AND USER_FOLLOWER = $2 AND STATE = 'following') AS isFollowing`;

  const checkPendingQuery = `SELECT EXISTS(SELECT 1 FROM FOLLOW WHERE USER_FOLLOWING = $1 AND USER_FOLLOWER = $2 AND STATE = 'pending') AS isPending`;

  const checkPublicStatusQuery = `SELECT PUBLIC AS isPublic FROM "USER" WHERE ACCOUNT_ID = $1`;

  const insertFollowingQuery = `INSERT INTO FOLLOW (USER_FOLLOWING, USER_FOLLOWER, STATE) VALUES ($1, $2, 'following')`;

  const insertPendingQuery = `INSERT INTO FOLLOW (USER_FOLLOWING, USER_FOLLOWER, STATE) VALUES ($1, $2, 'pending')`;

  const deleteFollowQuery = `DELETE FROM FOLLOW WHERE USER_FOLLOWING = $1 AND USER_FOLLOWER = $2`;

  let client;
  try {
    client = await pool.connect();

    // Check if the user is already following the target user
    const { rows: followingRows } = await client.query(checkFollowingQuery, [
      targetID,
      userID,
    ]);
    const { rows: pendingRows } = await client.query(checkPendingQuery, [
      targetID,
      userID,
    ]);
    const isFollowing = followingRows[0].isfollowing === true;
    const isPending = pendingRows[0].ispending === true;

    // If not following, proceed with follow logic
    if (!isFollowing && !isPending) {
      // Check if the target user is public or private
      const { rows: publicRows } = await client.query(checkPublicStatusQuery, [
        targetID,
      ]);
      const isPublic = publicRows[0].ispublic === true;

      if (isPublic) {
        // Insert a new row with 'following' state
        await client.query(insertFollowingQuery, [targetID, userID]);
        res.status(200).send({ message: "Successfully followed public user." });
      } else {
        // Insert a new row with 'pending' state
        await client.query(insertPendingQuery, [targetID, userID]);
        res
          .status(200)
          .send({
            message: "Successfully sent follow request to private user.",
          });
      }
    } else {
      // If already following, delete the follow entry
      await client.query(deleteFollowQuery, [targetID, userID]);
      res.status(200).send({ message: "Successfully unfollowed user." });
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
