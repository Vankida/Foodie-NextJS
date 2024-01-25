import { User } from "@/app/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/account/login:
 *   post:
 *     summary: login to the system
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/TokenResponse'
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

export async function POST(req) {
  const body = await req.json();
  const options = {
    autoIndex: true,
  };

  mongoose.connect(process.env.MONGO_URL, options);

  try {
    const { email, password } = body;

    // Find the user based on the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        {
          message: "Invalid email or password",
        },
        { status: 401 }
      ); // HTTP 401 Unauthorized
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return Response.json(
        {
          message: "Invalid email or password",
        },
        { status: 401 }
      ); // HTTP 401 Unauthorized
    }

    // Generate a JWT token
    const secret = process.env.SECRET;
    const token = jwt.sign({ userId: user.id }, secret, {
      expiresIn: "8h",
    });
    // Include the token in the response
    return Response.json(
      {
        token: token,
      },
      { status: 200 }
    ); // HTTP 200 OK
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
