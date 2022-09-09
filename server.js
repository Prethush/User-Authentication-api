require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const logger = require("morgan");
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");

connectDB();
// middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// routes
app.use("/api/user", require("./routes/auth"));

app.use((req, res, next) => {
  next();
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Something broke" });
});
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
});
