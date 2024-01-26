const express = require("express");
const {
  createUser,
  loginUser,
  checkUser,
} = require("../controllers/auth.controller");
const passport = require("passport");

const authRouter = express.Router();
//  /auth is already added in base path
authRouter
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check", passport.authenticate("jwt"), checkUser);

module.exports = authRouter;
