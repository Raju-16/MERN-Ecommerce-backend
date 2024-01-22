const express = require("express");
const {
  fetchCategories,
  createCategory,
} = require("../controllers/categories.controller");

const categoryRouter = express.Router();
//  /categories is already added in base path
categoryRouter.get("/", fetchCategories).post("/", createCategory);

module.exports = categoryRouter;
