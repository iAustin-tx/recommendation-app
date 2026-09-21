const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");
const itemRoutes = require("./routes/itemRoutes");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Recommendation App API is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/recommendations", recommendationRoutes);

// These MUST come after all routes
app.use(notFound);
app.use(errorHandler);

module.exports = app;
