const mongoose = require("mongoose");
const dns = require("node:dns");

const connectDB = async () => {
  try {
    const mongoUri = (process.env.MONGO_URI || process.env.MONGODB_URI)?.trim();

    if (!mongoUri) {
      throw new Error(
        "Set MONGO_URI (or MONGODB_URI) in backend/.env"
      );
    }

    if (/\\[_@]/.test(mongoUri)) {
      throw new Error(
        "Remove backslashes before _ and @ in your MongoDB URI. URL-encode special characters in credentials."
      );
    }

    if (
      !mongoUri.startsWith("mongodb://") &&
      !mongoUri.startsWith("mongodb+srv://")
    ) {
      throw new Error(
        "MONGO_URI must start with mongodb:// or mongodb+srv://"
      );
    }

    // Optional override for environments whose default DNS cannot resolve Atlas SRV records.
    const dnsServers = process.env.MONGO_DNS_SERVERS
      ?.split(",")
      .map((server) => server.trim())
      .filter(Boolean);

    if (dnsServers?.length) {
      dns.setServers(dnsServers);
    }

    console.log("Connecting to MongoDB...");

    const connection = await mongoose.connect(
      mongoUri,
      {
        serverSelectionTimeoutMS: 10000,
      }
    );

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    const message = String(error.message || "Unknown connection error").replace(
      /mongodb(?:\+srv)?:\/\/[^\s]+/gi,
      "[MongoDB URI redacted]"
    );
    const dnsFailure = /querySrv|queryTxt|ENOTFOUND|EAI_AGAIN|ETIMEOUT|ECONNREFUSED/.test(message);
    const hint = dnsFailure
      ? " DNS lookup failed. Check your network and MONGO_DNS_SERVERS setting. If SRV lookups are blocked, use the standard mongodb:// connection string supplied by Atlas with its actual hosts and replica set."
      : "";
    throw new Error(`MongoDB connection failed: ${message}${hint}`);
  }
};

module.exports = connectDB;
