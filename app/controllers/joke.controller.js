const db = require("../models");
const Joke = db.jokes;

// Create and Save a new Joke
exports.create = async (req, res, next) => {
  const { content } = req.body;
  try {
    // Create a Joke
    const joke = new Joke({
      content,
      s3Url: req.file.location,
      createdBy: req.user.username,
    });

    // Save Joke in the database
    joke
      .save(joke)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Joke.",
        });
      });
  } catch (err) {
    next(err);
  }
};

// Retrieve all Jokes from the database.
exports.findAll = async (req, res, next) => {
  Joke.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving jokes.",
      });
    });
};

// Find a single Joke with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  Joke.findById(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving joke with id=" + id });
    });
};

// Update a Joke by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Joke.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Joke with id=${id}. Maybe Joke was not found!`,
        });
      } else res.send({ message: "Joke was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Joke with id=" + id,
      });
    });
};

// Delete a Joke with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  Joke.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Joke with id=${id}. Maybe Joke was not found!`,
        });
      } else {
        res.send({
          message: "Joke was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Joke with id=" + id,
      });
    });
};

// Delete all Jokes from the database.
exports.deleteAll = async (req, res) => {
  Joke.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Jokes were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all jokes.",
      });
    });
};
