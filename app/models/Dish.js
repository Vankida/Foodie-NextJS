import { model, models, Schema } from "mongoose";

const DishSchema = new Schema(
  {
    name: { type: String, required: true, index: true, unique: true },
    description: { type: String },
    price: { type: Number },
    image: { type: String },
    vegetarian: { type: Boolean, default: false },
    rating: { type: Number },
    category: { type: String },
    page: { type: Number },
    rateArr: [
      {
        userId: { type: String, required: true },
        rate: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Create a unique index on the name field
DishSchema.index({ name: 1 }, { unique: true });

export const Dish = models?.Dish || model("Dish", DishSchema);
