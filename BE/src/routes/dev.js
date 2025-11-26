const express = require("express");
const devRouter = express.Router();
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

// Only enable dev routes in development mode
if (process.env.NODE_ENV === "development") {
  devRouter.get("/dev/requests", async (req, res) => {
    try {
      const list = await ConnectionRequest.find({}).populate(
        "fromUserId toUserId",
        ["firstName", "lastName", "emailId", "photoUrl", "about"]
      );
      return res.status(200).json({ data: list });
    } catch (error) {
      console.error("[DEV] error fetching connection requests", error);
      return res.status(500).json({ message: error.message });
    }
  });
}

module.exports = {
  devRouter,
};
