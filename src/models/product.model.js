const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: [true, "this title is already exists"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    price: {
      type: Number,
      min: [1, "wrong min price"],
      max: [200000, "wrong max price"],
    },
    discountPercentage: {
      type: Number,
      min: [1, "wrong min discount"],
      max: [99, "wrong max discount"],
    },
    rating: {
      type: Number,
      min: [0, "wrong min rating"],
      max: [5, "wrong max price"],
      default: 0,
    },
    stock: {
      type: Number,
      min: [0, "wrong min stock"],
      default: 0,
    },
    brand: {
      type: String,
      required: [true, "brand is required"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
    },
    thumbnail: {
      type: String,
      required: [true, "thumbnail is required"],
    },
    images: {
      type: [String],
      required: [true, "product images is required"],
    },
    deleted: { type: Boolean, default: false },
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

productSchema.virtual("id").get(function () {
  return this._id;
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
