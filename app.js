const express = require("express");
const app = express();
require("dotenv").config();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested_With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

require("./routes")(app);
require("./db")();

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);
module.exports = server;
