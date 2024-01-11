import jwt from "jsonwebtoken";
import { Cart } from "@/app/models/Cart";
import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
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
 *   name: Cart
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
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
        success: false,
        message: "Authorization header missing",
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
    mongoose.connect(process.env.MONGO_URL);

    // Try to find an existing cart for the user
    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      let dishesInCart = existingCart.dishes;

      let modifiedDishes = dishesInCart.map((dish) => {
        // To remove the _id property
        const newDish = {
          dishId: dish.dishId,
          image: dish.image,
          name: dish.name,
          price: dish.price,
          totalPrice: dish.totalPrice,
          quantity: dish.quantity,
        };
        return newDish;
      });

      // return Response.json({ success: true, existingCart }, { status: 200 });
      return Response.json(modifiedDishes, { status: 200 });
    } else {
      return Response.json(
        { success: true, existingCart: "No cart found!" },
        { status: 200 }
      );
    }
  } catch (error) {
    // Token is invalid or expired
    return Response.json(
      {
        success: false,
        message: "Invalid or expired token",
      },
      { status: error.name === "TokenExpiredError" ? 401 : 403 }
    );
  }
}
