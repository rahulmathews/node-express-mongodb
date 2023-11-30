module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  const jwt_val = require("../libs/jwt-validator");

  var router = require("express").Router();

  // Create a new User
  router.post("/register", users.create);

  // Login as new User
  router.post("/login", users.login);

  // Retrieve all users
  router.get("/", jwt_val.default(), users.findAll);

  // Retrieve a single User with id
  router.get("/:id", jwt_val.default(), users.findOne);

  // Update a User with id
  router.put("/:id", jwt_val.default(), users.update);

  // Delete a User with id
  router.delete("/:id", jwt_val.default(), users.delete);

  // Create a new User
  router.delete("/", jwt_val.default(), users.deleteAll);

  app.use("/api/users", router);
};
