import { Dish } from "@/app/models/Dish";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  const { dish_id } = params;

  const options = {
    autoIndex: true,
  };

  mongoose.connect(process.env.MONGO_URL, options);

  try {
    const dish = await Dish.findById(dish_id);

    if (!dish) {
      return Response.json({
        success: false,
        message: "Dish not found",
      });
    }

    return Response.json({
      success: true,
      dish,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "An error occurred while fetching the dish",
    });
  }
}
