import { User } from "@/app/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/account/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               address:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 example: 2024-01-22T23:14:24.671Z
 *               gender:
 *                 type: string
 *                 example: Male
 *               phoneNumber:
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

export async function POST(req, res) {
  const body = await req.json();

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phoneNumber) => {
    if (!phoneNumber.length) return false;
    const regex = /^(\+7 \(\d{0,3}?\) \d{0,3}(-\d{0,2}){0,2}){0,2}$/;
    return regex.test(phoneNumber) && phoneNumber.match(/\d/g).length === 11;
  };

  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  if (
    !isValidEmail(body.email) ||
    !isValidPhone(body.phoneNumber) ||
    !isValidPassword(body.password)
  ) {
    return Response.json({ message: "Bad Request" }, { status: 400 });
  }

  const options = {
    autoIndex: true,
  };

  mongoose.connect(process.env.MONGO_URL, options);

  try {
    const pass = body.password;
    const notHashedPassword = pass;
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(notHashedPassword, salt);

    const createdUser = await User.create(body);

    // Generate a JWT token
    const secret = process.env.SECRET;
    const token = jwt.sign({ userId: createdUser._id }, secret, {
      expiresIn: "8h",
    });
    return Response.json({ token: token }, { status: 200 }); // HTTP 200 Created
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
