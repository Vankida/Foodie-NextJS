import { User } from "@/app/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
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

  const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
  const secret = process.env.SECRET;

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;

    // Get the user information from the database based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      ); // HTTP 404 Not Found
    }

    const filteredUser = {
      id: user._id,
      fullName: user.fullName,
      birthDate: user.birthDate,
      gender: user.gender,
      address: user.address,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.admin,
    };

    // Return the user's information
    return Response.json(filteredUser, { status: 200 }); // HTTP 200 OK
    // return Response.json({ success: true, user }, { status: 200 }); // HTTP 200 OK
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

export async function PUT(req) {
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

  const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
  const secret = process.env.SECRET;

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;

    // Get the user information from the database based on the userId
    let user = await User.findById(userId);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      ); // HTTP 404 Not Found
    }

    // Update the user information based on the request body
    const requestBody = await req.json();

    user.fullName = requestBody.fullName;
    user.address = requestBody.address;
    user.birthDate = requestBody.birthDate;
    user.gender = requestBody.gender;
    user.phoneNumber = requestBody.phoneNumber;

    // Save the updated user information
    user = await user.save();

    // Return the updated user's information
    return Response.json({ success: true, user }, { status: 200 }); // HTTP 200 OK
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
