const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://nodejscourse:nodejs123@cluster0.s1halyh.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
