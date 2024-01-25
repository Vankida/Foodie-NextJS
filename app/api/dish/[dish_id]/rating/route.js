import { Dish } from "@/app/models/Dish";
import { Order } from "@/app/models/Order";
import { User } from "@/app/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/dish/{id}/rating:
 *   post:
 *     summary: Set rating for a dish
 *     tags: [Dish]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: ratingScore
 *         required: true
 *         schema:
 *           type: Number
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
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 */
export async function POST(req, { params }) {
  const { dish_id } = params;
  const ratingScore = req.nextUrl.searchParams.get("ratingScore");

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

      const dish = await Dish.findById(dish_id);

      if (!dish) {
        return Response.json(
          {
            message: "Dish not found",
          },
          { status: 404 }
        ); // HTTP 404 Not Found
      }

      // check if the user rated the dish before
      let ratedBefore = false;
      for (let i = 0; i < dish.rateArr.length; i++) {
        if (dish.rateArr[i].userId === userId) {
          ratedBefore = true;
          dish.rateArr[i].rate = ratingScore;
        }
      }
      if (!ratedBefore) {
        dish.rateArr.push({ userId: user.id, rate: ratingScore });
      }

      // dish.rating = (dish.rating + parseFloat(ratingScore)) / 2;

      let sum = 0;
      for (let i = 0; i < dish.rateArr.length; i++) {
        sum += dish.rateArr[i].rate;
      }
      let finalRate = sum / dish.rateArr.length;
      dish.rating = finalRate;

      await dish.save();

      // return Response.json(
      //   {
      //     message: dish,
      //     final: finalRate,
      //   },
      //   { status: 200 }
      // ); // HTTP 401 Unauthorized

      return Response.json({ status: 200 }); // HTTP 200 OK
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
