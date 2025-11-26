const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI ||
    "mongodb+srv://nodejscourse:nodejs123@cluster0.s1halyh.mongodb.net/devTinder";
  await mongoose.connect(mongoUri);
};

module.exports = connectDB;
