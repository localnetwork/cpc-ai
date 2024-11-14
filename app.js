require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");

const cors = require("cors");

const app = express();

app.use(cors());

app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Mobile Legends",
  });
});

const versions = process.env.VERSIONS.split(",");

// Path to the routes directory

versions.forEach((version) => {
  const routesPath = path.join(__dirname, `./src/routes/${version}`);
  if (fs.existsSync(routesPath)) {
    fs.readdirSync(routesPath).forEach((file) => {
      const route = require(path.join(routesPath, file));
      app.use(`/api/${version}`, route);
    });
  } else {
    console.warn(`Routes path not found: ${routesPath}`);
  }
});

// Handle other errors (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log("err", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Handle 404 - Route not found
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(process.env.APP_PORT || 1000, () => {
  console.log(`Running http://localhost:${process?.env?.APP_PORT || 1000}`);
});
