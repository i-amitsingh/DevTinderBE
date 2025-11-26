require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require("./config/Database");
const cookieParser = require("cookie-parser");

// Allow requests from the FE dev server and include credentials
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/requests");
const { userRouter } = require("./routes/user");
const { devRouter } = require("./routes/dev");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", devRouter);

connectDB()
  .then(() => {
    console.log("MongoDB Connected Successfully...");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.error("Database not connected."));
