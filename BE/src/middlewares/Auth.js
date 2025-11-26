const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    // read the token from req cookie or Authorization header
    const cookies = req.cookies || {};
    let token = cookies.token;
    if (!token) {
      const authHeader = req.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).send("User is not logged in");
    }

    // validate the user
    const jwtSecret = process.env.JWT_SECRET;
    const decodedObj = jwt.verify(token, jwtSecret);
    const { _id } = decodedObj;

    // find the user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).send("Authentication failed: User not found.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).send("Authentication failed: Invalid token.");
    }
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = { userAuth };
