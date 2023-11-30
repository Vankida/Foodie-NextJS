import jwt from "jsonwebtoken";
import { Dish } from "@/app/models/Dish";
import { User } from "@/app/models/User";
import mongoose from "mongoose";

// Create a dish.
export async function POST(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json({
      success: false,
      message: "Authorization header missing",
    });
  }
  const body = await req.json();

  const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
  const secret = process.env.SECRET;

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;

    // Get the user information from the database based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return Response.json({ success: false, message: "User not found" });
    }
    if (!user.admin) {
      return Response.json({ success: false, message: "User is not an admin" });
    }

    const { name } = body;
    const dish = await Dish.findOne({ name });
    if (dish) {
      return Response.json({
        success: false,
        message: "a dish with the same name already exists!",
      });
    }

    // Return the user's information
    // const body = await req.json();
    const options = {
      autoIndex: true, //this is the code I added that solved it all
    };
    mongoose.connect(process.env.MONGO_URL, options);

    const createdDish = await Dish.create(body);
    return Response.json({ success: true, createdDish });
  } catch (error) {
    // Token is invalid or expired
    return Response.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

// Get dishes.
export async function GET(req) {
  const options = {
    autoIndex: true, //this is the code I added that solved it all
  };
  mongoose.connect(process.env.MONGO_URL, options);
  try {
    const dishes = await Dish.find();
    return Response.json({ success: true, dishes });
  } catch (error) {
    return Response.json({
      success: false,
      message: "An error occurred while fetching dishes",
    });
  }
}

// // Get dish by id
// export async function GET(req) {
//   const { id } = req.query;

//   const options = {
//     autoIndex: true,
//   };

//   mongoose.connect(process.env.MONGO_URL, options);

//   try {
//     const dish = await Dish.findById(id);

//     if (!dish) {
//       return Response.json({
//         success: false,
//         message: "Dish not found",
//       });
//     }

//     return Response.json({
//       success: true,
//       dish,
//     });
//   } catch (error) {
//     return Response.json({
//       success: false,
//       message: "An error occurred while fetching the dish",
//     });
//   }
// }

// import { NextRequest } from "next/server";
// export async function GET(req) {
//   // const { dish_id } = req.query || {};

//   // const { dish_id } =req.params;
//   const { dish_id } = req.nextUrl.searchParams;

//   const options = {
//     autoIndex: true,
//   };
//   mongoose.connect(process.env.MONGO_URL, options);

//   // Get one dish
//   if (dish_id) {
//     // Fetch a specific dish by ID
//     const dish = await Dish.findById(dish_id);

//     if (!dish) {
//       return Response.json({
//         success: false,
//         message: "Dish not found",
//       });
//     }

//     return Response.json({
//       success: true,
//       dish,
//     });
//   }
//   // Get all dishes
//   else {
//     try {
//       const dishes = await Dish.find();
//       return Response.json({ success: true, dishes });
//     } catch (error) {
//       return Response.json({
//         success: false,
//         message: "An error occurred while fetching dishes",
//       });
//     }
//   }
// }
