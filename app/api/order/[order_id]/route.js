import jwt from "jsonwebtoken";
import { Order } from "@/app/models/Order";
import { User } from "@/app/models/User";
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
 *         - dishes
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
 *         dishes: array
 *         address: string
 *       example:
 *         id: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         deliveryTime: 2024-01-22T17:43:12.033Z
 *         orderTime: 2024-01-22T17:43:12.033Z
 *         status: InProcess
 *         price: 0
 *         dishes: [{
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "price": 0,
      "totalPrice": 0,
      "amount": 0,
      "image": "string"
    }]
 *         address: string
 */

/**
 * @swagger
 * /api/order/{orderId}:
 *   get:
 *     summary: Get information about a concrete order
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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

export async function GET(req, { params }) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    ); // HTTP 401 Unauthorized
  }

  const { order_id } = params;

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

    // Find the specific order by order_id and userId
    const order = await Order.findOne({ _id: order_id, userId });

    if (!order) {
      return Response.json(
        {
          message: "Order not found",
        },
        { status: 404 }
      ); // HTTP 404 Not Found
    }

    const filteredDishes = [];
    for (let i = 0; i < order.dishes.length; i++) {
      let filteredDish = {
        id: order.dishes[i].dishId,
        name: order.dishes[i].dishName,
        price: order.dishes[i].dishPrice,
        totalPrice: order.dishes[i].totalPrice,
        amount: order.dishes[i].amount,
        image: order.dishes[i].dishImage,
      };
      filteredDishes.push(filteredDish);
    }
    const filteredOrder = {
      id: order._id,
      deliveryTime: order.deliveryTime,
      orderTime: order.orderTime,
      status: order.status,
      price: order.price,
      dishes: filteredDishes,
      address: order.address,
    };

    return Response.json(filteredOrder, { status: 200 }); // HTTP 200 OK
  } catch (error) {
    // Token is invalid or expired
    return Response.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    ); // HTTP 401 Unauthorized
  }
}
