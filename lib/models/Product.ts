import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: String,
      required: true,
    },

    oldPrice: {
      type: String,
    },

    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    rating: {
      type: String,
      default: "5.0",
    },

    badge: {
      type: String,
      default: "New",
    },

    warranty: {
      type: String,
      default: "",
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    freeDelivery: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Product ||
  mongoose.model("Product", ProductSchema);