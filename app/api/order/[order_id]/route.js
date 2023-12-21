import jwt from "jsonwebtoken";
import { Order } from "@/app/models/Order";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json({
      success: false,
      message: "Authorization header missing",
    });
  }

  const { order_id } = params;

  const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
  const secret = process.env.SECRET;

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;
    mongoose.connect(process.env.MONGO_URL);
    // Find the specific order by order_id and userId
    const order = await Order.findOne({ _id: order_id, userId });

    if (!order) {
      return Response.json({
        success: false,
        message: "Order not found",
      });
    }
    return Response.json({ success: true, order });
  } catch (error) {
    // Token is invalid or expired
    return Response.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
