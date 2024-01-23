const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    quantity: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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

const virtual = cartSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
