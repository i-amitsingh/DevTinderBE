const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // index: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      // index: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "accepted", "rejected", "interested"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // check from and to userId are same
  if (
    connectionRequest.fromUserId.toString() ===
    connectionRequest.toUserId.toString()
  ) {
    throw new Error("Cannot send connection request to yourself.");
  }
  next();
});

module.exports = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

// const ConnectionRequestModel = new mongoose.model(
//   "ConnectionRequest",
//   connectionRequestSchema
// );

// module.exports = ConnectionRequestModel;
