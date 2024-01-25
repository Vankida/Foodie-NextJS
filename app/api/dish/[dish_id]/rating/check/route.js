import { Dish } from "@/app/models/Dish";
import { Order } from "@/app/models/Order";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/dish/{id}/rating/check:
 *   get:
 *     summary: Checks if user is able to set rating of the dish
 *     tags: [Dish]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               items:
 *                 $ref: '#/components/schemas/boolean'
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
          message: "Unauthorized",
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
            message: "Dish not found",
          },
          { status: 404 }
        ); // HTTP 404 Not Found
      }

      // Check if the user has ordered the dish before
      const orders = await Order.find({ userId });

      let final = false;

      for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < orders[i].dishes.length; j++) {
          if (orders[i].dishes[j].dishId === dish_id) {
            final = true;
            break;
          }
        }
      }

      if (orders.length > 0) {
        return Response.json(final, { status: 200 }); // HTTP 200 OK
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
          message: "Unauthorized",
        },
        { status: 401 }
      ); // HTTP 401 Unauthorized
    }
  } catch (error) {
    return Response.json(
      {
        message: "An error occurred while fetching the dish",
      },
      { status: 500 }
    ); // HTTP 500 Internal Server Error
  }
}
