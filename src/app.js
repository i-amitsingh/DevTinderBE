const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const connectDB = require("./config/Database");
const cookieParser = require("cookie-parser");
// const cors = require("cors");

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(cookieParser());

// Routes
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/requests");
const { userRouter } = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("MongoDB Connected Successfully...");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.error("Database not connected."));
