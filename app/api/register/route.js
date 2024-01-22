import { User } from "@/app/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

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

    return Response.json(createdUser, 201); // HTTP 201 Created
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "An error occurred while creating the user",
      },
      500
    ); // HTTP 500 Internal Server Error
  }
  // finally {
  //   mongoose.connection.close();
  // }
}
