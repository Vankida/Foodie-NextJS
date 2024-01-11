import jwt from "jsonwebtoken";
import { Cart } from "@/app/models/Cart";
import { Dish } from "@/app/models/Dish";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/cart/{dishId}:
 *   post:
 *     summary: Add dish to cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: dishId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 */

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

  const dish = await Dish.findById(dish_id);

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
          dish.totalPrice = dish.price * dish.quantity;
          dishUpdated = true;
          break; // Exit the loop once the dish is found and updated
        }
      }

      // If the dish doesn't exist, add it to the cart
      if (!dishUpdated) {
        existingCart.dishes.push({
          dishId: dish_id,
          name: dish.name,
          price: dish.price,
          totalPrice: dish.price,
          quantity: 1,
          image: dish.image,
        });
      }

      // Save the updated cart
      await existingCart.save();
    } else {
      // If no cart exists, create a new one with the specified dish
      await Cart.create({
        userId,
        dishes: [
          {
            dishId: dish_id,
            name: dish.name,
            price: dish.price,
            totalPrice: dish.price,
            quantity: 1,
            image: dish.image,
          },
        ],
      });
    }

    return Response.json({
      success: true,
      message: "Dish has been added successfully!",
    });
    // return Response.json({
    //   success: true,
    //   createdCart: true,
    //   existingCart,
    // });
  } catch (error) {
    // Token is invalid or expired
    return Response.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
