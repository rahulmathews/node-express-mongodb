module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      type: String,
      status: String,
      content: String,
      upvotes: Number,
      downvotes: Number,
      reports: Number,
      views: Number,
      rating: Number,
      createdBy: String,
    },

    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Joke = mongoose.model("joke", schema);
  return Joke;
};
