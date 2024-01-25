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
 * components:
 *   schemas:
 *     boolean:
 *       type: boolean
 *       example:
 *         true
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TokenResponse:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *       example:
 *         token: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: array
 *       required:
 *         - id
 *         - fullName
 *         - birthDate
 *         - gender
 *         - address
 *         - email
 *         - phoneNumber
 *       properties:
 *         id:
 *           type: string
 *         fullName:
 *           type: string
 *         birthDate:
 *           type: string
 *         gender:
 *           type: string
 *         address:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *       example:
 *         id: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         fullName: string
 *         birthDate: 2024-01-25T14:25:11.077Z
 *         gender: Male
 *         address: string
 *         email: user@example.com
 *         phoneNumber: string
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
    mongoose.connect(process.env.MONGO_URL);

    const existingCart = await Cart.findOne({ userId });

    if (!existingCart) {
      return Response.json(
        {
          message: "Cart not found for the user",
        },
        { status: 404 }
      ); // HTTP 404 Not Found
    }

    // return Response.json({
    //   existingCart,
    // });

    const dishes = [];
    for (const item of existingCart.dishes) {
      let dish = await Dish.findById(item.dishId);
      if (dish) {
        let newDish = {
          dishId: item.dishId,
          dishName: dish.name,
          dishPrice: dish.price,
          totalPrice: dish.price * item.quantity,
          amount: item.quantity,
          dishImage: dish.image,
        };
        dishes.push(newDish);
      } else {
        return Response.json(
          {
            message: "Dish not found in the database",
          },
          { status: 404 }
        ); // HTTP 404 Not Found
      }
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

    existingCart.dishes = [];
    await existingCart.save();

    return Response.json({ status: 200 }); // HTTP 201 Created
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
    mongoose.connect(process.env.MONGO_URL);
    const orders = await Order.find({ userId });

    const filteredOrders = [];
    for (let i = 0; i < orders.length; i++) {
      let filteredOrder = {
        id: orders[i].id,
        deliveryTime: orders[i].deliveryTime,
        orderTime: orders[i].orderTime,
        status: orders[i].status,
        price: orders[i].price,
      };
      filteredOrders.push(filteredOrder);
    }

    return Response.json(filteredOrders, { status: 200 }); // HTTP 200 OK
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
