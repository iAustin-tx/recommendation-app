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
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);
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
