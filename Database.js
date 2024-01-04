require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.SERVER_MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("DATABASE CONNECTION SUCCESSFUL");
    
  } catch (error) {
    console.log("Database error: ", error.message);
  }
}

module.exports = connectDB;
