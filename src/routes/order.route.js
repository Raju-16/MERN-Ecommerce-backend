const express = require("express");
const {
  createOrder,
  fetchOrdersByUser,
  deleteOrder,
  updateOrder,
} = require("../controllers/order.controller");

const orderRouter = express.Router();
//  /orders is already added in base path
orderRouter
  .post("/", createOrder)
  .get("/", fetchOrdersByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder);

module.exports = orderRouter;
