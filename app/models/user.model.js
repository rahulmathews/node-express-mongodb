module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      type: String,
      userId: String,
      email: String,
      phone: Number,
      password: String,
      isEmailVerified: Boolean,
      isPhoneVerified: Boolean,
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
