const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      index: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "{VALUE} is not a valid gender",
      },
    },
    photourl: {
      type: String,
    },
    about: {
      type: String,
      default: "Default Bio...",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const jwtSecret = process.env.JWT_SECRET || "DEV@Tinder$786";
  const token = await jwt.sign({ _id: user._id }, jwtSecret, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};
// const UserModel = mongoose.model("User", userSchema);
// module.exports = UserModel;

module.exports = mongoose.model("User", userSchema);
