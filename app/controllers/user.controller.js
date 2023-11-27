const db = require("../models");
const aws = require("../libs/aws-cognito.service");
const User = db.users;

const { hash } = require("bcrypt");

// Create and Save a new User
exports.create = async (req, res, next) => {
  const { email, firstName, phone, password } = req.body;
  try {
    const awsResp = await aws.registerUser({ firstName, email, password });

    const hashedPassword = await hash(password, 10);
    // Create a User
    const user = new User({
      email,
      phone,
      userId: awsResp.userSub,
      password: hashedPassword,
      isEmailVerified: true,
    });

    // Save User in the database
    user
      .save(user)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      });
  } catch (err) {
    next(err);
  }
};

// Create and Save a new User
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const awsResp = await aws.authenticateUser({ email, password });

    return res.send({
      accessToken: awsResp.accessToken,
      refreshToken: awsResp.refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve all Users from the database.
exports.findAll = async (req, res, next) => {
  const name = req.query.name;
  console.log("User", req.user);
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  User.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Find a single User with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Update a User by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`,
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      } else {
        res.send({
          message: "User was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = async (req, res) => {
  User.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Users were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};
