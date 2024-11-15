const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { server, app } = require("./Socket/Scoket.js");

dotenv.config();

const PORT = process.env.PORT || 3000;

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// Middleware to handle preflight requests for all routes
app.options("*", cors());

// Logging middleware to debug incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Define routes
app.use("/api/auth", require("./Routes/authRoutes.js"));
app.use("/api/chat", require("./Routes/chatRoutes.js"));
app.use("/api/user", require("./Routes/userRoutes.js"));

app.get("/api/hello", (res) => {
  return res.json({
    success: true,
    message: "Server is Running",
  });
});

// Error handling middleware
app.use((err, res) => {
  const statusCode = err.statusCode || 500;
  const errorMsg = err.message || "Internal Server Error !!";
  console.error(`Error: ${errorMsg}`); // Log the error
  return res.status(statusCode).json({
    success: false,
    message: errorMsg,
  });
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(PORT, () => {
      console.log("Server is Running at Port", PORT);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed", error);
  });
