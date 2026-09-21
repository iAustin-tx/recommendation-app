const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const connectDB = require("./config/database");
const Activity = require("./models/Activity");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await Activity.init();

    await new Promise((resolve, reject) => {
      app.listen(PORT, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
