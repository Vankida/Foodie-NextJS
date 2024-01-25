import jwt from "jsonwebtoken";
import { Cart } from "@/app/models/Cart";
import { User } from "@/app/models/User";
import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Basket:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - totalPrice
 *         - amount
 *         - image
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         totalPrice:
 *           type: number
 *         amount:
 *           type: number
 *         image:
 *           type: string
 *       example:
 *         id: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         name: string
 *         price: 0
 *         totalPrice: 0
 *         amount: 0
 *         image: string
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Response:
 *       type: object
 *       required:
 *         - status
 *         - message
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 *       example:
 *         status: string
 *         message: string
 */

/**
 * @swagger
 * tags:
 *   name: Basket
 */

/**
 * @swagger
 * /api/basket:
 *   get:
 *     summary: Get user basket
 *     tags: [Basket]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Basket'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 */

export async function GET(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
  const secret = process.env.SECRET;

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;

    // Get the user information from the database based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 }); // HTTP 404 Not Found
    }
    if (!user.loggedIn) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    mongoose.connect(process.env.MONGO_URL);

    // Try to find an existing cart for the user
    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      let dishesInCart = existingCart.dishes;

      let modifiedDishes = dishesInCart.map((dish) => {
        // To remove the _id property
        const newDish = {
          id: dish.dishId,
          image: dish.image,
          name: dish.name,
          price: dish.price,
          totalPrice: dish.totalPrice,
          amount: dish.quantity,
        };
        return newDish;
      });

      return Response.json(modifiedDishes, { status: 200 });
    } else {
      // "No cart found!"
      return Response.json([], { status: 200 });
    }
  } catch (error) {
    // Token is invalid or expired
    return Response.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
}
