import { User } from "@/app/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

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
          success: false,
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
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      ); // HTTP 401 Unauthorized
    }

    // User and password are valid, you can proceed with the login logic here
    // For example, you can generate a JWT token and send it back to the client

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
    return Response.json(
      {
        status: false,
        message: "An error occurred during login",
      },
      { status: 500 }
    ); // HTTP 500 Internal Server Error
  }
  // finally {
  //   mongoose.connection.close();
  // }
}
