const express = require("express");
const cors = require("cors");
const server = express();
const dbConnect = require("./src/config/dbConnect");

const productRouter = require("./src/routes/products.route");
const brandRouter = require("./src/routes/brands.route");
const categoryRouter = require("./src/routes/categories.route");
const userRouter = require("./src/routes/user.route");
const cartRouter = require("./src/routes/cart.route");
const orderRouter = require("./src/routes/order.route");
const authRouter = require("./src/routes/auth.route");

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(express.json()); // to parse req.body
server.use("/products", productRouter);
server.use("/brands", brandRouter);
server.use("/categories", categoryRouter);
server.use("/users", userRouter);
server.use("/cart", cartRouter);
server.use("/orders", orderRouter);
server.use("/auth", authRouter);

server.listen(8080, async () => {
  try {
    await dbConnect();
    console.log("Connected to Database");
  } catch (error) {
    console.log({ Error: error.message });
  }
});
