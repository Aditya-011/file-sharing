// Full Documentation - https://docs.turbo360.co
const vertex = require("vertex360")({ site_id: process.env.TURBO_APP_ID });
const express = require("express");
require("dotenv").config();
const app = express(); // initialize app
const cors = require("cors");
const path = require("path");
/*  Apps are configured with settings as shown in the conig object below.
    Options include setting views directory, static assets directory,
    and database settings. Default config settings can be seen here:
    https://docs.turbo360.co */
app.use(express.static("public"));
app.set("view engine", "ejs");
const config = {
  views: "views", // Set views directory
  static: "public", // Set static assets directory
  logging: true,
};

vertex.configureApp(app, config);

// import routes
const index = require("./routes/index");
const api = require("./routes/api"); // sample API Routes
const corsOptions = {
  origin: "http://localhost:3000",
  // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
};
// set routes
app.use("/", index);
app.use("/api", api); // sample API Routes
app.use(cors(corsOptions));

const connectDB = require("./config/db");
connectDB();
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));
app.use(express.json());
module.exports = app;
