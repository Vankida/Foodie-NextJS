import { User } from "@/app/models/User";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/account/logout:
 *   post:
 *     summary: login to the system
 *     tags: [User]
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

    user.loggedIn = false;
    await user.save();

    // Return the user's information
    return Response.json({ message: "Logged out!" }, { status: 200 }); // HTTP 200 OK
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
