const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "label is required"],
      unique: true,
    },
    value: {
      type: String,
      required: [true, "value is required"],
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

const virtual = categorySchema.virtual("id");
virtual.get(function () {
  return this._id;
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
