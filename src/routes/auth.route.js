const express = require("express");
const { createUser, loginUser } = require("../controllers/auth.controller");

const authRouter = express.Router();
//  /auth is already added in base path
authRouter.post("/signup", createUser).post("/login", loginUser);

module.exports = authRouter;
