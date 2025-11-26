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
    photoUrl: {
      type: String,
      default:
        "https://imgs.search.brave.com/UJZSsRapFSBnYPuNNR_nHsrrwcK3DgGiP3xeG8E6iAQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDUv/NzExLzE4NS9zbWFs/bC9tYWxlLXByb2Zp/bGUtcGljdHVyZS1w/bGFjZWhvbGRlci1m/b3Itc29jaWFsLW1l/ZGlhLWZvcnVtLWRh/dGluZy1zaXRlLWNo/YXQtb3BlcmF0b3It/ZGVzaWduLXNvY2lh/bC1wcm9maWxlLXRl/bXBsYXRlLWRlZmF1/bHQtYXZhdGFyLWlj/b24tZmxhdC1zdHls/ZS1mcmVlLXZlY3Rv/ci5qcGc",
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
  const jwtSecret = process.env.JWT_SECRET;
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
