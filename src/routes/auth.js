const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/Validation");
// const { userAuth } = require("../middlewares/Auth");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the data
    validateSignupData(req);

    // encrypt the password
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
    });
    await user.save();
    res.status(201).send("User registered successfully!");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      throw new Error("Incorrect Password");
    }
    if (isMatch) {
      // Generate JWT token
      const token = await user.getJWT();
      // add token to cookie and send response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).send("User Loggedin successfully!");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User Logged out successfully!");
});

module.exports = {
  authRouter,
};
