const express = require("express");
const {
  fetchBrands,
  createBrand,
} = require("../controllers/brands.controller");

const brandRouter = express.Router();
//  /brands is already added in base path
brandRouter.get("/", fetchBrands).post("/", createBrand);

module.exports = brandRouter;
