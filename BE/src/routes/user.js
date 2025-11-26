const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/Auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

// getting requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log("[DEBUG] requests/received called for user", loggedInUser._id);
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "emailId",
      "photoUrl",
      "about",
    ]);
    console.log("[DEBUG] requests/received data", connectionRequests);
    return res.status(200).json({ data: connectionRequests });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// getting connections
userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log("[DEBUG] user/connection called for user", loggedInUser._id);
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "photoUrl", "about"])
      .populate("toUserId", ["firstName", "lastName", "photoUrl", "about"]);

    console.log("[DEBUG] user/connection raw data", connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    console.log("[DEBUG] user/connection processed data", data);
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = Number.isInteger(parseInt(req.query.page))
      ? parseInt(req.query.page)
      : 1;
    const limit = Number.isInteger(parseInt(req.query.limit))
      ? parseInt(req.query.limit)
      : 30;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");
    //   .populate("toUserId", "firstName ")
    //   .populate("fromUserId", "firstName ");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    console.log(
      "[DEBUG] hideUsersFromFeed ids =>",
      Array.from(hideUsersFromFeed)
    );

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName age gender about skills photoUrl")
      .skip(skip)
      .limit(limit);

    console.log("[DEBUG] feed users count:", users.length);
    return res.status(200).json({ data: users });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = {
  userRouter,
};
