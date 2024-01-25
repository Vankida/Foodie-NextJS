import jwt from "jsonwebtoken";
import { Cart } from "@/app/models/Cart";
import { Dish } from "@/app/models/Dish";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/cart/{dishId}:
 *   post:
 *     summary: Add dish to cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: dishId
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
 *         description: Not found
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 */

// Add to cart.
export async function POST(req, { params }) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json(
      {
        status: false,
        message: "Authorization header missing",
      },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
  const secret = process.env.SECRET;

  const { dish_id } = params;

  const dish = await Dish.findById(dish_id);

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;
    mongoose.connect(process.env.MONGO_URL);

    // Try to find an existing cart for the user
    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      // Check if the dish already exists in the cart
      let dishUpdated = false;
      for (const dish of existingCart.dishes) {
        if (dish.dishId === dish_id) {
          // If the dish exists, increment its quantity
          dish.quantity += 1;
          dish.totalPrice = dish.price * dish.quantity;
          dishUpdated = true;
          break; // Exit the loop once the dish is found and updated
        }
      }

      // If the dish doesn't exist, add it to the cart
      if (!dishUpdated) {
        existingCart.dishes.push({
          dishId: dish_id,
          name: dish.name,
          price: dish.price,
          totalPrice: dish.price,
          quantity: 1,
          image: dish.image,
        });
      }

      // Save the updated cart
      await existingCart.save();
    } else {
      // If no cart exists, create a new one with the specified dish
      await Cart.create({
        userId,
        dishes: [
          {
            dishId: dish_id,
            name: dish.name,
            price: dish.price,
            totalPrice: dish.price,
            quantity: 1,
            image: dish.image,
          },
        ],
      });
    }

    return Response.json(
      // {
      //   status: true,
      //   message: "Dish has been added successfully!",
      // },
      { status: 200 }
    );
  } catch (error) {
    // Token is invalid or expired
    return Response.json(
      {
        status: false,
        message: "Invalid or expired token",
      },
      { status: 401 }
    );
  }
}

/**
 * @swagger
 * /api/cart/{dishId}:
 *   delete:
 *     summary: Decrease the number of dishes in the cart(if increase = true), or remove the dish completely(increase = false)
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: dishId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: increase
 *         required: true
 *         default: false
 *         schema:
 *           type: boolean
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
 *         description: Not found
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 */

export async function DELETE(req, { params }) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json(
      {
        status: false,
        message: "Authorization header missing",
      },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1]; // Remove the "Bearer " prefix
  const secret = process.env.SECRET;

  const { dish_id } = params;
  let decreaseQuantity = req.nextUrl.searchParams.get("increase");
  // decreaseQuantity === "true";

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;
    mongoose.connect(process.env.MONGO_URL);

    // Find the user's cart
    const existingCart = await Cart.findOne({ userId });

    if (!existingCart) {
      return Response.json(
        {
          status: false,
          message: "Cart not found",
        },
        { status: 404 }
      );
    }

    // Check if the dish exists in the cart
    const index = existingCart.dishes.findIndex(
      (dish) => dish.dishId === dish_id
    );

    if (index !== -1) {
      if (decreaseQuantity === "true") {
        // Decrease the quantity of the dish in the cart
        if (existingCart.dishes[index].quantity > 1) {
          existingCart.dishes[index].quantity -= 1;
          existingCart.dishes[index].totalPrice =
            existingCart.dishes[index].price *
            existingCart.dishes[index].quantity;
        } else {
          // If quantity is 1, remove the dish from the cart
          existingCart.dishes.splice(index, 1);
        }
      } else {
        // Delete all dishes with the specified ID from the cart
        // existingCart.dishes = existingCart.dishes.filter(
        //   (dish) => dish.dishId !== dish_id
        // );
        existingCart.dishes.splice(index, existingCart.dishes[index].quantity);
      }

      // Save the updated cart
      await existingCart.save();

      return Response.json(
        // {
        //   status: true,
        //   message: "Dish quantity decreased successfully!",
        //   // decreaseQuantity: decreaseQuantity,
        // },
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          status: false,
          message: "Dish not found in the cart",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    // Token is invalid or expired
    return Response.json(
      {
        success: false,
        message: "Invalid or expired token",
      },
      { status: 401 }
    );
  }
}
