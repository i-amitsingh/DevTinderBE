const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/Auth");
const { validateEditProfileData } = require("../utils/Validation");
const bcrypt = require("bcrypt");
// const { User } = require("../models/User");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedinUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedinUser[key] = req.body[key];
    });
    await loggedinUser.save();
    res.status(200).json({
      message: `${loggedinUser.firstName}, your profile has been updated successfully.`,
      data: loggedinUser,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword } = req.body;
    const { newPassword } = req.body;
    if (!user.verifyPassword(currentPassword)) {
      throw new Error("Incorrect current password");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});
module.exports = {
  profileRouter,
};
