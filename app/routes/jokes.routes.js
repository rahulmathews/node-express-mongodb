module.exports = (app) => {
  const jokes = require("../controllers/joke.controller.js");

  const jwt_val = require("../libs/jwt-validator");

  var router = require("express").Router();

  // Create a new Joke
  router.post("/", jwt_val.default(), jokes.create);

  // Retrieve all jokes
  router.get("/", jwt_val.default(), jokes.findAll);

  // Retrieve a single Joke with id
  router.get("/:id", jwt_val.default(), jokes.findOne);

  // Update a Joke with id
  router.put("/:id", jwt_val.default(), jokes.update);

  // Delete a Joke with id
  router.delete("/:id", jwt_val.default(), jokes.delete);

  // Create a new Joke
  router.delete("/", jwt_val.default(), jokes.deleteAll);

  app.use("/api/jokes", router);
};
