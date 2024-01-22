const express = require("express");
const cors = require("cors");
const dbConnect = require("./src/config/dbConnect");
const productRouter = require("./src/routes/products.route");
const brandRouter = require("./src/routes/brands.route");
const categoryRouter = require("./src/routes/categories.route");
const server = express();

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); // to parse req.body

server.use("/products", productRouter);
server.use("/brands", brandRouter);
server.use("/categories", categoryRouter);

server.listen(8080, async () => {
  try {
    await dbConnect();
    console.log("Connected to Database");
  } catch (error) {
    console.log({ Error: error.message });
  }
});
