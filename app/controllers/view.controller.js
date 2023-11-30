const db = require("../models");

const View = db.views;
const Joke = db.jokes;

// Create and Save a new View
exports.create = async (req, res, next) => {
  const { jokeId } = req.body;
  try {
    // Create a View
    const query = {
      jokeId: jokeId,
      createdBy: req.user.username,
    };

    const update = {
      $set: {},
    };

    // Save View in the database
    View.findOneAndUpdate(query, update, {
      upsert: true,
      includeResultMetadata: true,
    })
      .then((data) => {
        return Joke.findOneAndUpdate(
          { _id: jokeId },
          { $inc: { views: 1 } },
          { upsert: true, new: true }
        );
      })
      .then((data) => {
        return res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the View.",
        });
      });
  } catch (err) {
    next(err);
  }
};

// Retrieve all views from the database.
exports.findAll = async (req, res, next) => {
  View.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving views.",
      });
    });
};

// Find a single View with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  View.findOne(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving View with id=" + id });
    });
};

// Update a View by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  View.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update View with id=${id}. Maybe View was not found!`,
        });
      } else res.send({ message: "View was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating View with id=" + id,
      });
    });
};

// Delete a View with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  View.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete View with id=${id}. Maybe View was not found!`,
        });
      } else {
        res.send({
          message: "View was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete View with id=" + id,
      });
    });
};

// Delete all views from the database.
exports.deleteAll = async (req, res) => {
  View.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} views were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all views.",
      });
    });
};
