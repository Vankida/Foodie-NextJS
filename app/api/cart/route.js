import jwt from "jsonwebtoken";
import { Cart } from "@/app/models/Cart";
import mongoose from "mongoose";

// Add to cart.
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

    // Try to find an existing cart for the user
    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      return Response.json({ success: true, existingCart });
    } else {
      return Response.json({ success: true, existingCart: false });
    }

    // return Response.json({ success: true, createdCart: true, existingCart });
  } catch (error) {
    // Token is invalid or expired
    return Response.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
