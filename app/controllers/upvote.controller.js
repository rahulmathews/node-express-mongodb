const db = require("../models");
const Upvote = db.upvotes;
const Joke = db.jokes;

// Create and Save a new Upvote
exports.create = async (req, res, next) => {
  const { jokeId } = req.body;
  try {
    // Create a Upvote
    const query = {
      jokeId: jokeId,
      createdBy: req.user.username,
    };

    const update = {
      $set: {},
    };

    // Save Upvote in the database
    Upvote.findOneAndUpdate(query, update, { upsert: true, new: true })
      .then((data) => {
        return Joke.findOneAndUpdate(
          { _id: jokeId },
          { $inc: { upvotes: 1 } },
          { upsert: true, new: true }
        );
      })
      .then((data) => {
        return res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Upvote.",
        });
      });
  } catch (err) {
    next(err);
  }
};

// Retrieve all Upvotes from the database.
exports.findAll = async (req, res, next) => {
  Upvote.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving upvotes.",
      });
    });
};

// Find a single Upvote with an jokeId
exports.findOne = async (req, res) => {
  const id = req.params.id;

  const query = {
    jokeId: id,
    createdBy: req.user.username,
  };
  Upvote.findOne(query)
    .then((data) => {
      return res.send(data || {});
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Upvote with id=" + id });
    });
};

// Update a Upvote by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Upvote.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Upvote with id=${id}. Maybe Upvote was not found!`,
        });
      } else res.send({ message: "Upvote was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Upvote with id=" + id,
      });
    });
};

// Delete a Upvote with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  Upvote.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Upvote with id=${id}. Maybe Upvote was not found!`,
        });
      } else {
        res.send({
          message: "Upvote was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Upvote with id=" + id,
      });
    });
};

// Delete all Upvotes from the database.
exports.deleteAll = async (req, res) => {
  Upvote.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Upvotes were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all upvotes.",
      });
    });
};
