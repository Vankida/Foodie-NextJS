import jwt from "jsonwebtoken";
import { Cart } from "@/app/models/Cart";
import mongoose from "mongoose";

// Add to cart.
export async function POST(req, { params }) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json({
      success: false,
      message: "Authorization header missing",
    });
  }

  const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
  const secret = process.env.SECRET;

  const { dish_id } = params;

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;
    mongoose.connect(process.env.MONGO_URL);

    // Try to find an existing cart for the user
    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      // Check if the dish already exists in the cart
      let dishUpdated = false;
      for (const dish of existingCart.dishes) {
        if (dish.dishId === dish_id) {
          // If the dish exists, increment its quantity
          dish.quantity += 1;
          dishUpdated = true;
          break; // Exit the loop once the dish is found and updated
        }
      }

      // If the dish doesn't exist, add it to the cart
      if (!dishUpdated) {
        existingCart.dishes.push({ dishId: dish_id, quantity: 1 });
      }

      // Save the updated cart
      await existingCart.save();
    } else {
      // If no cart exists, create a new one with the specified dish
      await Cart.create({
        userId,
        dishes: [{ dishId: dish_id, quantity: 1 }],
      });
    }

    return Response.json({ success: true, createdCart: true, existingCart });
  } catch (error) {
    // Token is invalid or expired
    return Response.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
