const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description fetch all echoes for the non-login viewer
 *
 * @component API/echo
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/fetchPublicEcho", async (req, res) => {
  /**
   * The fetching query
   *
   * get ECHO_ID, AUTHOR_USERNAME, POSTER_ID, CONTENT,
   * NUM_LIKES,  NUM_COMMENTS, NUM_REECHOS, LATEST_UPDATE_TIME, REECHO_FLAG, REECHO_ID,
   * USER_LIKED, IMAGE_IDS, IMAGES, IMAGE_TYPES from the database
   *
   * Sort by the ECHO_ID
   */
  const query = `
    SELECT
      E.ECHO_ID,
      E.POSTER_ID,
      A.USERNAME AS AUTHOR_USERNAME,
      E.CONTENT,
      COUNT(DISTINCT L.LIKE_USER_ID) AS NUM_LIKES,
      COUNT(DISTINCT C.COMMENT_ID) AS NUM_COMMENTS,
      COUNT(DISTINCT R.ECHO_ID) AS NUM_REECHOS,
      ARRAY_AGG(DISTINCT EI.ECHO_ID) AS IMAGE_IDS,
      ARRAY_AGG(DISTINCT EI.IMAGE) AS IMAGES,
      ARRAY_AGG(DISTINCT EI.IMAGE_TYPE) AS IMAGE_TYPES,
      E.LATEST_UPDATE_TIME,
      E.REECHO_FLAG,
      E.REECHO_ID
    FROM
      ECHO E
    LEFT JOIN
      LIKE_ECHO L ON E.ECHO_ID = L.ECHO_ID
    LEFT JOIN
      COMMENT C ON E.ECHO_ID = C.ECHO_ID
    LEFT JOIN
      ECHO R ON E.ECHO_ID = R.REECHO_ID
    LEFT JOIN
      "USER" U ON E.POSTER_ID = U.ACCOUNT_ID
    LEFT JOIN
      ACCOUNT A ON A.ACCOUNT_ID = E.POSTER_ID
    LEFT JOIN
      ECHO_IMAGES EI ON E.ECHO_ID = EI.ECHO_ID
    WHERE
      U.PUBLIC = TRUE AND
      U.SUSPENSION_STATE = FALSE AND
      E.SUSPENSION_STATE = FALSE
    GROUP BY
      E.ECHO_ID, E.POSTER_ID, A.USERNAME, E.CONTENT, E.LATEST_UPDATE_TIME, E.REECHO_FLAG, E.REECHO_ID
    ORDER BY E.ECHO_ID DESC;
  `;

  let client;
  try {
    client = await pool.connect();

    const result = await client.query(query);

    if (result.rows.length === 0) {
      res.status(400).send({ message: "No Echoes" });
      return;
    }

    // process image BYTEA to the base64 URI
    const processedRows = result.rows.map((row) => {
      let images = [];
      if (Array.isArray(row.images) && row.images[0] !== null) {
        images = row.images.map((imageArray, index) => {
          const base64Image = imageArray?.toString("base64");
          const imageType = row.image_types[index];
          const imageId = row.image_ids[index];
          const src = `data:${imageType};base64,${base64Image}`;

          return src;
        });
      }

      // return data of an echo the informations as an object
      return {
        id: row.echo_id,
        author: row.author_username,
        posterid: row.poster_id,
        content: row.content,
        likeCount: row.num_likes,
        commentCount: row.num_comments,
        repostCount: row.num_reechos,
        date: new Date(row.latest_update_time).toISOString().split("T")[0],
        reecho_flag: row.reecho_flag,
        reecho_id: row.reecho_id,
        user_liked: row.user_liked,
        images: images,
      };
    });

    res
      .status(200)
      .send({
        message: "Successfully fetch public echoes",
        result: processedRows,
      });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(400).send({ message: "Wrong Query" });
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = router;
