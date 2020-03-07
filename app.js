const express = require("express");
const app = express();
require("dotenv").config();

require("./routes")(app);
require("./db")();

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);
module.exports = server;
