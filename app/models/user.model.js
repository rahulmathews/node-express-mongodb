module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      type: { type: String, default: "USER" },
      status: {
        type: String,
        default: "NEW",
        enum: ["NEW", "APPROVE", "ACTIVE"],
      },
      userId: { type: String, unique: true },
      email: { type: String, unique: true },
      firstName: String,
      lastName: String,
      phone: Number,
      password: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};
