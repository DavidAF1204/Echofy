const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description fetch particular echo for the user/ non-login viewer
 *
 * @component API/echo
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/fetchEcho/", async (req, res) => {
  // get echoID and userID fromt the HTTP request body
  const { echoID, userID } = req.body;

  let client;
  try {
    client = await pool.connect();

    /**
     * The fetching query
     *
     * get ECHO_ID, AUTHOR_USERNAME, POSTER_ID, CONTENT,
     * NUM_LIKES,  NUM_COMMENTS, NUM_REECHOS, LATEST_UPDATE_TIME, REECHO_FLAG, REECHO_ID,
     * USER_LIKED, IMAGE_IDS, IMAGES, IMAGE_TYPES from the database
     *
     * Condidtion: if the poster is public account, or the userID is the follower of the poster_id
     */
    const echoQuery = `
      SELECT
        E.echo_id,
        E.poster_id,
        E.content,
        E.latest_update_time,
        E.reecho_flag,
        E.reecho_id,
        E.suspension_state,
        A.username AS author_username,
        COUNT(R.reecho_id) AS repostCount,
        COUNT(DISTINCT L.like_user_id) AS likeCount,
        COUNT(C.comment_id) AS commentCount,
        EXISTS(SELECT 1 FROM LIKE_ECHO WHERE echo_id = E.echo_id AND like_user_id = $1) AS user_liked,
        ARRAY_AGG(DISTINCT EI.echo_id) AS image_ids,
        ARRAY_AGG(DISTINCT EI.image) AS images,
        ARRAY_AGG(DISTINCT EI.image_type) AS image_types
      FROM
        ECHO E
      INNER JOIN
        "USER" U ON E.poster_id = U.account_id
      INNER JOIN
        ACCOUNT A ON U.account_id = A.account_id
      LEFT JOIN
        ECHO R ON E.echo_id = R.reecho_id
      LEFT JOIN
        LIKE_ECHO L ON E.echo_id = L.echo_id
      LEFT JOIN
        COMMENT C ON E.echo_id = C.echo_id
      LEFT JOIN
        ECHO_IMAGES EI ON E.echo_id = EI.echo_id
      LEFT JOIN
        FOLLOW F ON F.user_following = U.account_id AND F.user_follower = $1
      WHERE
        E.echo_id = $2
        AND (
          U.public = TRUE 
          OR U.account_id = $1 
          OR F.user_following IS NOT NULL 
        )
      GROUP BY
        E.echo_id,
        E.poster_id,
        E.content,
        E.latest_update_time,
        E.reecho_flag,
        E.reecho_id,
        E.suspension_state,
        A.username
    `;

    const echoResult = await client.query(echoQuery, [userID, echoID]);

    if (echoResult.rows.length === 0) {
      console.log("No result");
      res.status(400).send({ message: "No Echo found" });
      return;
    }

    // process image BYTEA to the base64 URI
    let images_url = [];
    let temp = echoResult.rows[0].images;
    if (Array.isArray(temp) && echoResult.rows[0].images[0] !== null) {
      images_url = temp.map((image) => {
        if (image === null) return "";
        const base64Image = image.toString("base64");
        const imageType = echoResult.rows[0].image_type;
        const imageUrl = `data:${imageType};base64,${base64Image}`;
        return imageUrl;
      });
    } else {
      console.error("images is not an array");
    }

    // return data of an echo the informations as an object
    const processedEcho = {
      id: echoResult.rows[0].echo_id,
      author: echoResult.rows[0].author_username,
      posterid: echoResult.rows[0].poster_id,
      content: echoResult.rows[0].content,
      likeCount: parseInt(echoResult.rows[0].likecount),
      commentCount: parseInt(echoResult.rows[0].commentcount),
      repostCount: parseInt(echoResult.rows[0].repostcount),
      date: new Date(echoResult.rows[0].latest_update_time)
        .toISOString()
        .split("T")[0],
      reecho_flag: echoResult.rows[0].reecho_flag,
      reecho_id: echoResult.rows[0].reecho_id,
      user_liked: echoResult.rows[0].user_liked,
      images: images_url,
    };

    res.status(200).send(processedEcho);
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
