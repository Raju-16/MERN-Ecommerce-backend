const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    items: { type: [Schema.Types.Mixed], required: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    //TODO:  we can add enum types
    paymentMethod: { type: String, required: true },
    status: { type: String, default: "pending" },
    selectedAddress: { type: [Schema.Types.Mixed], required: true },
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

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
