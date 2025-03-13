const express = require("express");
const router = express.Router();
const pool = require("../../dbconnect");

/**
 * @description fetch the profile owner's Reecho from the database
 *
 * @component API/user
 * @param {HTTP_Request} req
 * @param {HTTP_Response} res
 * @returns null
 * @export {router} router
 */

router.post("/fetchProfileReEchoes", async (req, res) => {
  // Set the userID from the body of a HTTP request body
  const { userID } = req.body;

  // fetch reecho for the user profile
  const fetchProfileReEchoesQuery = `
  SELECT
    E.REECHO_ID,
    E.POSTER_ID,
    E.CONTENT,
    COUNT(DISTINCT L.LIKE_USER_ID) AS NUM_LIKES,
    ARRAY_AGG(DISTINCT EI) AS IMAGES,
    EXISTS(SELECT 1 FROM LIKE_ECHO WHERE ECHO_ID = E.REECHO_ID AND LIKE_USER_ID = $1) AS USER_LIKED,
    E.LATEST_UPDATE_TIME,
    E.REECHO_FLAG
  FROM
    ECHO E
  LEFT JOIN
    LIKE_ECHO L ON E.REECHO_ID = L.ECHO_ID
  LEFT JOIN
    COMMENT C ON E.REECHO_ID = C.ECHO_ID
  LEFT JOIN
    ECHO R ON E.REECHO_ID = R.REECHO_ID
  LEFT JOIN
    ECHO_IMAGES EI ON E.REECHO_ID = EI.ECHO_ID
  WHERE
    E.POSTER_ID = $1
    AND E.REECHO_FLAG = TRUE
    AND E.SUSPENSION_STATE = FALSE
  GROUP BY
    E.REECHO_ID,
    E.POSTER_ID,
    E.CONTENT,
    E.LATEST_UPDATE_TIME,
    E.REECHO_FLAG
  ORDER BY
    E.REECHO_ID DESC;`;

  let client;
  try {
    client = await pool.connect();

    const { rows } = await client.query(fetchProfileReEchoesQuery, [userID]);

    // Process the rows to format the images as img.src base64 URLs
    const processedRows = rows.map((row) => {
      let images = [];
      if (Array.isArray(row.IMAGES)) {
        images = row.IMAGES.map((image) => {
          return `data:image/${image.img_type};base64,${image.img}`;
        });
      }
      return { ...row, IMAGES: images };
    });

    res.status(200).send({
      message: "Profile ReEchoes fetched successfully!",
      results: processedRows,
    });
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
