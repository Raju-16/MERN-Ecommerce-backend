const express = require("express");
const {
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
} = require("../controllers/cart.controller");

const cartRouter = express.Router();
//  /products is already added in base path
cartRouter
  .post("/", addToCart)
  .get("/", fetchCartByUser)
  .delete("/:id", deleteFromCart)
  .patch("/:id", updateCart);

module.exports = cartRouter;
