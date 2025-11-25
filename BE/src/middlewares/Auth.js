const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    // read the token from req cookie
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      return res.status(401).send("User is not logged in");
    }

    // validate the user
    const decodedObj = await jwt.verify(token, "DEV@Tinder$786");
    const { _id } = decodedObj;

    // find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = { userAuth };
