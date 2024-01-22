import jwt from "jsonwebtoken";
import { Order } from "@/app/models/Order";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/order/{orderId}/status:
 *   post:
 *     summary: Confim order delivery
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: No Found
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 */

export async function POST(req, { params }) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json(
      {
        success: false,
        message: "Authorization header missing",
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
    mongoose.connect(process.env.MONGO_URL);

    // Find the specific order by order_id and userId
    const order = await Order.findOne({ _id: order_id, userId });

    if (!order) {
      return Response.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      ); // HTTP 404 Not Found
    }

    // Update the status to "Confirmed"
    order.status = "Confirmed";
    await order.save();

    return Response.json(
      { success: true, msg: "Order confirmed" },
      { status: 200 }
    ); // HTTP 200 OK
  } catch (error) {
    // Token is invalid or expired
    return Response.json(
      {
        success: false,
        message: "Invalid or expired token",
      },
      { status: 401 }
    ); // HTTP 401 Unauthorized
  }
  // finally {
  //   mongoose.connection.close();
  // }
}
