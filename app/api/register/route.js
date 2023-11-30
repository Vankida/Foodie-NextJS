import { User } from "@/app/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function POST(req) {
  const body = await req.json();
  //   return Response.json(body);
  const options = {
    autoIndex: true, //this is the code I added that solved it all
  };
  mongoose.connect(process.env.MONGO_URL, options);
  const pass = body.password;
  const notHashedPassword = pass;
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(notHashedPassword, salt);

  const createdUser = await User.create(body);
  return Response.json(createdUser);
}
