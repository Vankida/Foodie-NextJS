import jwt from "jsonwebtoken";
import { Cart } from "@/app/models/Cart";
import { Order } from "@/app/models/Order";
import { Dish } from "@/app/models/Dish";
import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderInfo:
 *       type: array
 *       required:
 *         - id
 *         - deliveryTime
 *         - orderTime
 *         - status
 *         - price
 *       properties:
 *         id:
 *           type: string
 *         deliveryTime:
 *           type: string
 *         orderTime:
 *           type: string
 *         status:
 *           type: string
 *         price:
 *           type: number
 *       example:
 *         id: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         deliveryTime: 2024-01-22T17:43:12.033Z
 *         orderTime: 2024-01-22T17:43:12.033Z
 *         status: InProcess
 *         price: 0
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOrder:
 *       type: array
 *       required:
 *         - deliveryTime
 *         - address
 *       properties:
 *         deliveryTime:
 *           type: string
 *         address:
 *           type: string
 *       example:
 *         deliveryTime: 2024-01-22T17:43:12.033Z
 *         address: string
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Creates an order from dishes in basket
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryTime:
 *                 type: string
 *                 example: 2024-01-22T17:51:07.757Z
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
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

// Add order.
export async function POST(req) {
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

    const existingCart = await Cart.findOne({ userId });

    const dishes = [];
    for (const item of existingCart.dishes) {
      let dish = await Dish.findById(item.dishId);
      let newDish = {
        dishId: item.dishId,
        dishName: dish.name,
        dishPrice: dish.price,
        totalPrice: dish.price * item.quantity,
        amount: item.quantity,
        dishImage: dish.image,
      };
      dishes.push(newDish);
    }

    let orderSum = 0;
    dishes.map((dish) => {
      orderSum += dish.totalPrice;
    });

    const requestBody = await req.json();
    await Order.create({
      userId: userId,
      deliveryTime: requestBody.deliveryTime,
      orderTime: requestBody.deliveryTime,
      status: "InProcess",
      price: orderSum,
      address: requestBody.address,
      dishes: [...dishes],
    });
    return Response.json({ success: true, msg: "order created!" });
  } catch (error) {
    // Token is invalid or expired
    return Response.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
  // finally {
  //   mongoose.connection.close();
  // }
}

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get a list of orders
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderInfo'
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
    const orders = await Order.find({ userId });
    return Response.json({ success: true, orders });
  } catch (error) {
    // Token is invalid or expired
    return Response.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
