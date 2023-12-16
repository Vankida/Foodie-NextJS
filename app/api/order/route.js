import jwt from "jsonwebtoken";
import { Cart } from "@/app/models/Cart";
import { Order } from "@/app/models/Order";
import { Dish } from "@/app/models/Dish";
import mongoose from "mongoose";

// mongoose.connect(process.env.MONGO_URL);

// Add order.
export async function POST(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json({
      success: false,
      message: "Authorization header missing",
    });
  }

  const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
  const secret = process.env.SECRET;

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;
    mongoose.connect(process.env.MONGO_URL);

    const existingCart = await Cart.findOne({ userId });

    const dishes = [];
    for (const item of existingCart.dishes) {
      let dish = await Dish.findById(item.dishId);
      let newDish = {
        dishId: item.dishId,
        dishName: dish.name,
        dishPrice: dish.price,
        totalPrice: dish.price * item.quantity,
        amount: item.quantity,
        dishImage: dish.image,
      };
      dishes.push(newDish);
    }

    let orderSum = 0;
    dishes.map((dish) => {
      orderSum += dish.totalPrice;
    });

    const requestBody = await req.json();
    await Order.create({
      userId: userId,
      deliveryTime: requestBody.deliveryTime,
      orderTime: requestBody.deliveryTime,
      status: "InProcess",
      price: orderSum,
      address: requestBody.address,
      dishes: [...dishes],
    });
    return Response.json({ success: true, msg: "order created!" });
  } catch (error) {
    // Token is invalid or expired
    return Response.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
  // finally {
  //   mongoose.connection.close();
  // }
}

export async function GET(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json({
      success: false,
      message: "Authorization header missing",
    });
  }

  const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
  const secret = process.env.SECRET;

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;
    mongoose.connect(process.env.MONGO_URL);
    const orders = await Order.find({ userId });
    return Response.json({ success: true, orders });
  } catch (error) {
    // Token is invalid or expired
    return Response.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
