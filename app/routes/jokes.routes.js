const s3 = require("../libs/aws-s3.js");

module.exports = (app) => {
  const jokes = require("../controllers/joke.controller.js");

  const jwt_val = require("../libs/jwt-validator");

  var router = require("express").Router();

  // Create a new Joke
  router.post("/", s3.uploadS3.single("file"), jokes.create);

  // Retrieve all jokes
  router.get("/", jokes.findAll);

  // Retrieve a single Joke with id
  router.get("/:id", jokes.findOne);

  // Update a Joke with id
  router.put("/:id", jokes.update);

  // Delete a Joke with id
  router.delete("/:id", jokes.delete);

  // Create a new Joke
  router.delete("/", jokes.deleteAll);

  app.use("/api/jokes", jwt_val.default(), router);
};
