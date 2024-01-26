const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();

const dbConnect = () => {
  try {
    return mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log({ message: error.message });
  }
};

module.exports = dbConnect;
