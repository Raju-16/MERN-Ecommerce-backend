const express = require("express");
const {
  createOrder,
  fetchOrdersByUser,
  deleteOrder,
  updateOrder,
  fetchAllOrders,
} = require("../controllers/order.controller");

const orderRouter = express.Router();
//  /orders is already added in base path
orderRouter
  .post("/", createOrder)
  .get("/own", fetchOrdersByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders);

module.exports = orderRouter;
