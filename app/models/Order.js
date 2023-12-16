import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: { type: String },
    deliveryTime: { type: String },
    orderTime: { type: String },
    status: { type: String },
    price: { type: Number },
    dishes: [
      {
        dishId: { type: String },
        dishName: { type: String },
        dishPrice: { type: Number },
        totalPrice: { type: Number },
        amount: { type: Number },
        dishImage: { type: String },
      },
    ],
    address: { type: String },
  },
  { timestamps: true }
);

export const Order = models?.Order || model("Order", OrderSchema);
