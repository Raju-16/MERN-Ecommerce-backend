const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: Buffer, required: true },
    role: { type: String, required: true, default: "user" },
    addresses: { type: [mongoose.Schema.Types.Mixed] },
    // TODO:  We can make a separate Schema for this
    name: { type: String },
    salt: Buffer,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id; // replace _id to id
        delete ret._id; // delete the id
        delete ret.__v; // delete the versionKey
      },
    },
  }
);

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
