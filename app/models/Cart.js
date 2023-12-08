import { model, models, Schema } from "mongoose";

const CartSchema = new Schema(
  {
    userId: { type: String, required: true },
    dishes: [
      {
        dishId: { type: String, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

// Create a unique index on the email field
CartSchema.index({ userId: 1 }, { unique: true });

export const Cart = models?.Cart || model("Cart", CartSchema);
