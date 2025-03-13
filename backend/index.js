const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const createTables = require("./tables/createtable");
require("dotenv").config();

/**
 * @description main function of the backend
 *
 * @component API and database
 */

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3001;
app.use(express.json({ limit: "10gb" }));
app.use(express.urlencoded({ limit: "10gb", extended: true }));

// API front page
app.get("/", (req, res) => {
  res.status(200);
  res.send("Welcome to Echofy backend!");
});

createTables();

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Echofy backend is successfully running, and Echofy backend server is listening on port " +
        PORT
    );
  } else {
    console.log("Error occurred, Echofy backend server can't start", error);
  }
});

const login = require("./api/auth/login");
app.use("", login);
const register = require("./api/auth/register");
app.use("", register);
const adminRegister = require("./api/auth/admin_register");
app.use("", adminRegister);
const protected = require("./api/auth/protected");
app.use("", protected);
const showTable = require("./api/showTable");
app.use("", showTable);

const resetPw = require("./api/user/resetPassword");
app.use("", resetPw);
const deleteAccount = require("./api/user/deleteAccount");
app.use("", deleteAccount);
const searchUser = require("./api/user/searchUser");
app.use("", searchUser);
const followUser = require("./api/user/followUser");
app.use("", followUser);
const acceptFollow = require("./api/user/acceptFollow");
app.use("", acceptFollow);
const userRecommendation = require("./api/user/userRecommendation");
app.use("", userRecommendation);
const fetchProfile = require("./api/user/fetchProfile");
app.use("", fetchProfile);
const editProfile = require("./api/user/editProfile");
app.use("", editProfile);

const listAllUsers = require("./api/admin/listAllUsers");
app.use("", listAllUsers);
const suspendUser = require("./api/admin/suspendUser");
app.use("", suspendUser);
const suspendEcho = require("./api/admin/suspendEcho");
app.use("", suspendEcho);
const suspendComment = require("./api/admin/suspendComment");
app.use("", suspendComment);

const postComment = require("./api/comment/postComment");
app.use("", postComment);
const fetchComment = require("./api/comment/fetchComment");
app.use("", fetchComment);
const likeUnlikeComment = require("./api/comment/likeUnlikeComment");
app.use("", likeUnlikeComment);
const editComment = require("./api/comment/editComment");
app.use("", editComment);
const deleteComment = require("./api/comment/deleteComment");
app.use("", deleteComment);

const fetchProfileReEchoes = require("./api/user/fetchProfileReEchoes");
app.use("", fetchProfileReEchoes);
const fetchProfileEchoes = require("./api/user/fetchProfileEchoes");
app.use("", fetchProfileEchoes);
const fetchFollowingStatus = require("./api/user/fetchFollowingStatus");
app.use("", fetchFollowingStatus);
const fetchPendingList = require("./api/user/fetchPendingList");
app.use("", fetchPendingList);

const postEcho = require("./api/echo/postEcho");
app.use("", postEcho);
const fetchEcho = require("./api/echo/fetchEcho");
app.use("", fetchEcho);
const likeDislikeComment = require("./api/echo/likeDislikeEcho");
app.use("", likeDislikeComment);
const editEcho = require("./api/echo/editEcho");
app.use("", editEcho);
const deleteEcho = require("./api/echo/deleteEcho");
app.use("", deleteEcho);
const reEcho = require("./api/echo/reEcho");
app.use("", reEcho);
const recommendEcho = require("./api/echo/recommendEcho");
app.use("", recommendEcho);
const fetchAllFollowingEcho = require("./api/echo/fetchAllFollowingEcho");
app.use("", fetchAllFollowingEcho);
const fetchPublicEcho = require("./api/echo/fetchPublicEcho");
app.use("", fetchPublicEcho);
