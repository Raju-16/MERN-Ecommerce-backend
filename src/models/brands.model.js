const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
      unique: true,
    },
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

const virtual = brandSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
