import jwt from "jsonwebtoken";
import { Dish } from "@/app/models/Dish";
import { User } from "@/app/models/User";
import mongoose from "mongoose";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   name: Dish
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DishList:
 *       type: array
 *       required:
 *         - id
 *         - name
 *         - description
 *         - price
 *         - image
 *         - vegetarian
 *         - rating
 *         - category

 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         vegetarian:
 *           type: boolean
 *         rating:
 *           type: number
 *         image:
 *           type: string
 *         category:
 *           type: string
 *       example:
 *         id: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         name: string
 *         description: string
 *         price: 0
 *         image: string
 *         vegetarian: true
 *         rating: 0
 *         category: "Wok"
 */

/**
 * @swagger
 * /api/dish:
 *   post:
 *     summary: Add a dish to the list of dishes
 *     tags: [Admin]
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

// Create a dish.
export async function POST(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json({
      success: false,
      message: "Authorization header missing",
    });
  }
  const body = await req.json();

  const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
  const secret = process.env.SECRET;

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;

    // Get the user information from the database based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return Response.json({ success: false, message: "User not found" });
    }
    if (!user.admin) {
      return Response.json({ success: false, message: "User is not an admin" });
    }

    const { name } = body;
    const dish = await Dish.findOne({ name });
    if (dish) {
      return Response.json({
        success: false,
        message: "a dish with the same name already exists!",
      });
    }

    const options = {
      autoIndex: true,
    };
    mongoose.connect(process.env.MONGO_URL, options);

    const createdDish = await Dish.create(body);
    return Response.json({ success: true, createdDish });
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
 * /api/dish:
 *   get:
 *     summary: Get a list of dishes (menu)
 *     tags: [Dish]
 *     parameters:
 *       - in: query
 *         name: categories
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["Wok", "Pizza", "Soup", "Dessert", "Drink"]
 *       - in: query
 *         name: vegetarian
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *           enum: [true, false]
 *       - in: query
 *         name: sorting
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["NameAsc", "NameDesc", "PriceAsc", "PriceDesc", "RatingAsc", "RatingDesc"]
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DishList'
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

// Get dishes.
export async function GET(req) {
  const options = {
    autoIndex: true, //this is the code I added that solved it all
  };
  mongoose.connect(process.env.MONGO_URL, options);

  const page = req.nextUrl.searchParams.get("page");
  const categories = req.nextUrl.searchParams.getAll("categories");
  const sorting = req.nextUrl.searchParams.get("sorting");
  const vegetarian = req.nextUrl.searchParams.get("vegetarian");

  try {
    let dishes = await Dish.find();

    if (sorting == "NameAsc") {
      dishes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sorting == "NameDesc") {
      dishes.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sorting == "PriceAsc") {
      dishes.sort((a, b) => a.price - b.price);
    } else if (sorting == "PriceDesc") {
      dishes.sort((a, b) => b.price - a.price);
    } else if (sorting == "RatingAsc") {
      dishes.sort((a, b) => a.rating - b.rating);
    } else if (sorting == "RatingDesc") {
      dishes.sort((a, b) => b.rating - a.rating);
    }

    if (categories.length > 0) {
      dishes = dishes.filter((dish) => categories.includes(dish.category));
    }

    if (vegetarian == "true") {
      dishes = dishes.filter((dish) => dish.vegetarian); // Correct the spelling later.
    }

    return Response.json({
      success: true,
      dishes,
      params: { page, categories, sorting, vegetarian },
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "An error occurred while fetching dishes",
    });
  }
}
