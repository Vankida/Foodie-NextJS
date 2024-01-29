import { User } from "@/app/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

export async function POST(req) {
  const body = await req.json();

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

    const isValidEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    if (!isValidEmail(body.email)) {
      return Response.json(
        {
          status: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Generate a JWT token
    const secret = process.env.SECRET;
    const token = jwt.sign({ userId: createdUser._id }, secret, {
      expiresIn: "8h",
    });

    // return Response.json(createdUser, { status: 200 }); // HTTP 201 Created
    return Response.json({ token: token }, { status: 200 }); // HTTP 201 Created
  } catch (error) {
    return Response.json(
      {
        status: false,
        message: "An error occurred while creating the user",
      },
      { status: 500 }
    ); // HTTP 500 Internal Server Error
  }
  // finally {
  //   mongoose.connection.close();
  // }
}
