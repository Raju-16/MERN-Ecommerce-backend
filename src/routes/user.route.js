const express = require("express");
const { fetchUserById, updateUser } = require("../controllers/user.controller");

const userRouter = express.Router();
//  /users is already added in base path
userRouter.get("/:id", fetchUserById).patch("/:id", updateUser);

module.exports = userRouter;
