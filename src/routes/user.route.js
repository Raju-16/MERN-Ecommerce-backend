const express = require("express");
const {
  fetchUserById,
  updateUser,
  getAllUser,
} = require("../controllers/user.controller");

const userRouter = express.Router();
//  /users is already added in base path
userRouter
  .get("/", getAllUser)
  .get("/:id", fetchUserById)
  .patch("/:id", updateUser);

module.exports = userRouter;
