import { Dish } from "@/app/models/Dish";
import { User } from "@/app/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  const { dish_id } = params;

  const options = {
    autoIndex: true,
  };

  mongoose.connect(process.env.MONGO_URL, options);

  try {
    const dish = await Dish.findById(dish_id);

    if (!dish) {
      return Response.json({
        success: false,
        message: "Dish not found",
      });
    }

    return Response.json({
      success: true,
      dish,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "An error occurred while fetching the dish",
    });
  }
}

/**
 * @swagger
 * /api/dish/{dish_id}:
 *   put:
 *     summary: Update a dish
 *     tags: [Dish]
 *     parameters:
 *       - in: path
 *         name: dishId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               vegeterian:
 *                 type: boolean
 *               rating:
 *                 type: number
 *               category:
 *                 type: string
 *               page:
 *                 type: number
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

export async function PUT(req, { params }) {
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

  mongoose.connect(process.env.MONGO_URL);

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;

    // Get the user information from the database based on the userId
    let user = await User.findById(userId);

    if (!user) {
      return Response.json({ success: false, message: "User not found" });
    }
    if (!user.admin) {
      return Response.json({ success: false, message: "User is not an admin" });
    }
    let dish = await Dish.findById(dish_id);

    if (!dish) {
      return Response.json({
        success: false,
        message: "Dish not found",
      });
    }

    // Update the dish information based on the request body
    const requestBody = await req.json();

    dish.name = requestBody.name;
    dish.description = requestBody.description;
    dish.price = requestBody.price;
    dish.image = requestBody.image;
    dish.vegeterian = requestBody.vegeterian;
    dish.rating = requestBody.rating;
    dish.category = requestBody.category;
    dish.page = requestBody.page;

    // Save the updated dish information
    dish = await dish.save();

    // Return the updated user's information
    return Response.json({ success: true, dish });
  } catch (error) {
    // Token is invalid or expired
    return Response.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

/**
 * @swagger
 * /api/dish/{dish_id}:
 *   delete:
 *     summary: Delete a dish
 *     tags: [Dish]
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
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 */
export async function DELETE(req, { params }) {
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

  mongoose.connect(process.env.MONGO_URL);

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;

    // Get the user information from the database based on the userId
    let user = await User.findById(userId);

    if (!user) {
      return Response.json({ success: false, message: "User not found" });
    }
    if (!user.admin) {
      return Response.json({ success: false, message: "User is not an admin" });
    }

    const dish = await Dish.findById(dish_id);

    if (!dish) {
      return Response.json({
        success: false,
        message: "Dish not found",
      });
    }
    const result = await Dish.deleteOne({ _id: dish_id });
    if (result.deletedCount === 0) {
      return Response.json({
        success: false,
        message: "Dish not found",
      });
    }
    return Response.json({
      success: true,
      message: "Dish deleted successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "An error occurred while deleting the dish",
    });
  }
}
