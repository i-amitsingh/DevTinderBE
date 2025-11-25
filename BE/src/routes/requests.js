const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/Auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // if (fromUserId == toUserId) {
      //   return res
      //     .status(400)
      //     .send("Cannot send connection request to yourself.");
      // }

      const allowedStatus = ["interested", "ignore"];

      // validate status type
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type: " + status);
      }

      // check if toUserId exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("Page not found!");
      }

      // console.log(toUser);

      // if there is already same existing connection request
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).send("Connection request already exists.");
      }

      // create a new connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.status(201).json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (Error) {
      res.status(400).send("Error : " + Error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedinUser = req.user;
      const { status, requestId } = req.params;

      // validate the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type: " + status);
      }

      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedinUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(404).send("Connection request not found.");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({
        message: "Connection request " + status + " successfully",
        data,
      });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

module.exports = {
  requestRouter,
};
