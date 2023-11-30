const express = require("express");
const cors = require("cors");

const app = express();

require("dotenv").config();

// parse requests of content-type - application/json
app.use(express.json());

app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Anonymous application." });
});

require("./app/routes/users.routes")(app);
require("./app/routes/jokes.routes")(app);
require("./app/routes/views.routes")(app);
require("./app/routes/upvotes.routes")(app);
require("./app/routes/downvotes.routes")(app);
require("./app/routes/reports.routes")(app);

app.use(function (err, req, res, next) {
  console.log("Error....", err);
  return res.sendStatus(500);
});

module.exports = app;