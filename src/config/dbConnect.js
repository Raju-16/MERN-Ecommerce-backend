const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    return mongoose.connect(
      "mongodb+srv://Raju94:Raju1994@cluster0.wvxeglg.mongodb.net/MERN-backend"
    );
  } catch (error) {
    console.log({ message: error.message });
  }
};

module.exports = dbConnect;
