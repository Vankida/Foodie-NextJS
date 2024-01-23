import { Dish } from "@/app/models/Dish";
import { Order } from "@/app/models/Order";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  const { dish_id } = params;

  const options = {
    autoIndex: true,
  };

  mongoose.connect(process.env.MONGO_URL, options);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return Response.json(
        {
          success: false,
          message: "Authorization header missing",
        },
        { status: 401 }
      ); // HTTP 401 Unauthorized
    }

    const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
    const secret = process.env.SECRET;

    try {
      // Verify the JWT token
      const decodedToken = jwt.verify(token, secret);
      const userId = decodedToken.userId;

      const dish = await Dish.findById(dish_id);

      if (!dish) {
        return Response.json(
          {
            success: false,
            message: "Dish not found",
          },
          { status: 404 }
        ); // HTTP 404 Not Found
      }

      // Check if the user has ordered the dish before
      const orders = await Order.find({ userId, dishes: { $in: [dish_id] } });

      if (orders.length > 0) {
        return Response.json(
          {
            canRate: true,
          },
          { status: 200 }
        ); // HTTP 200 OK
      } else {
        return Response.json(
          {
            canRate: false,
          },
          { status: 200 }
        ); // HTTP 200 OK
      }
    } catch (error) {
      // Token is invalid or expired
      return Response.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 }
      ); // HTTP 401 Unauthorized
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "An error occurred while fetching the dish",
      },
      { status: 500 }
    ); // HTTP 500 Internal Server Error
  }
}
