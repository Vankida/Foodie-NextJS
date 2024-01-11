import { model, models, Schema } from "mongoose";

const CartSchema = new Schema(
  {
    userId: { type: String, required: true },
    dishes: [
      {
        dishId: { type: String, required: true },
        name: { type: String },
        price: { type: String },
        totalPrice: { type: String },
        quantity: { type: Number, default: 1 },
        image: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Create a unique index on the userId field
CartSchema.index({ userId: 1 }, { unique: true });

export const Cart = models?.Cart || model("Cart", CartSchema);
