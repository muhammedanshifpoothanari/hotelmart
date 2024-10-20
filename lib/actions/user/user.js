'use server';

import clientPromise from "../user/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from 'bcryptjs'; // Make sure to install this package

// Register user
export const registerUser = async (phoneNumber, password) => {
    try {
        const client = await clientPromise;
        const db = client.db("eCommerceDB");

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create a new user
        const newUser = {
            mobileNumber: phoneNumber,
            password: hashedPassword,
        };

        const user = await db.collection("users").insertOne(newUser);
        return { success: true,id: user._id };
    } catch (error) {
        console.error("Error registering user:", error);
        return { success: false, error: error.message };
    }
};

// Validate password
export const validatePassword = async (phoneNumber, password) => {
    try {
        const client = await clientPromise;
        const db = client.db("eCommerceDB");

        // Fetch user by phone number
        const user = await db.collection("users").findOne({ mobileNumber: phoneNumber });
        if (user) {
            // Compare hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            return { success: isMatch,id: user._id };
        }
        return { success: false}; // User not found
    } catch (error) {
        console.error("Error validating password:", error);
        return { success: false, error: error.message };
    }
};

// Fetch user by mobile number
export const getUserByPhoneNumber = async (phoneNumber) => {
    try {
        const client = await clientPromise;
        const db = client.db("eCommerceDB");

        // Fetch user by phone number
        const user = await db.collection("users").findOne({ mobileNumber: phoneNumber });
        return { success: true, exists: !!user }; // Use !! to convert user to boolean
    } catch (error) {
        console.error("Error fetching user from database:", error);
        return { success: false, error: error.message };
    }
};


// Fetch all users
export const getAllUsers = async () => {
    try {
        const client = await clientPromise;
        const db = client.db("eCommerceDB");

        const users = await db.collection("users").find().toArray();
        return { success: true, data: users };
    } catch (error) {
        console.error("Error fetching users from database:", error);
        return { success: false, error: error.message };
    }
};

// Update user information
export const updateUser = async (id, data) => {
    try {
        const client = await clientPromise;
        const db = client.db("eCommerceDB");

        const result = await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: data });
        console.log("Updated user:", result);

        return { success: true, data: result };
    } catch (error) {
        console.error("Error updating user in database:", error);
        return { success: false, error: error.message };
    }
};

// Add item to user's cart
// Add item to user's cart
export const addToCart = async (userId, item) => {
  try {
      const client = await clientPromise;
      const db = client.db("eCommerceDB");

      // Find the user
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      if (!user) {
          throw new Error('User not found');
      }

      // Check if the product already exists in the cart
      const existingProductIndex = user.cart.findIndex(cartItem => cartItem._id.toString() === item._id.toString());

      if (existingProductIndex !== -1) {
          // If exists, update the quantity
          const updatedCart = user.cart.map((cartItem, index) => {
              if (index === existingProductIndex) {
                  // Ensure quantity is treated as an integer
                  const currentQuantity = parseInt(cartItem.cartQuantity.$numberInt) || 0; // Fallback to 0 if parsing fails
                  const additionalQuantity = parseInt(item.cartQuantity) || 0; // Ensure item.quantity is also treated as an integer
                  
                  return { 
                      ...cartItem, 
                      cartQuantity: { $numberInt: currentQuantity + additionalQuantity } // Update quantity
                  }; 
              }
              return cartItem;
          });

          // Update the user's cart with the new quantities
          await db.collection("users").updateOne(
              { _id: new ObjectId(userId) },
              { $set: { cart: updatedCart } }
          );
      } else {
          // If not exists, add the new product
          await db.collection("users").updateOne(
              { _id: new ObjectId(userId) },
              { $push: { cart: item } }
          );
      }

      console.log("Cart updated successfully");
      return { success: true };
  } catch (error) {
      console.error("Error adding item to cart:", error);
      return { success: false, error: error.message };
  }
};

// Add item to user's favorites
export const addToFavorites = async (userId, item) => {
  try {
      const client = await clientPromise;
      const db = client.db("eCommerceDB");

      // Find the user
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      if (!user) {
          throw new Error('User not found');
      }

      // Check if the item already exists in the favorites
      const existingItemIndex = user.favorites.findIndex(favItem => favItem._id.toString() === item._id.toString());

      if (existingItemIndex === -1) {
          // If not exists, add the new item to favorites
          const result = await db.collection("users").updateOne(
              { _id: new ObjectId(userId) },
              { $push: { favorites: item } }
          );
          console.log("Added item to favorites:", result);
      } else {
          console.log("Item already in favorites, not added again.");
      }

      return { success: true };
  } catch (error) {
      console.error("Error adding item to favorites:", error);
      return { success: false, error: error.message };
  }
};



export const getUserCart = async (userId) => {
  try {
      const client = await clientPromise;
      const db = client.db("eCommerceDB");

      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      
      // Convert MongoDB objects to regular JavaScript objects
      const cartItems = user?.cart?.map(item => ({
          ...item,
          price: item.price?.$numberInt ? Number(item.price.$numberInt) : item.price,
          quantity: item.cartQuantity?.$numberInt ? Number(item.cartQuantity.$numberInt) : item.cartQuantity,
          totalStock:item.quantity?.$numberInt ? Number(item.quantity.$numberInt) : item.quantity,
      })) || [];
      
      console.log("Fetched user's cart:", cartItems);

      return { success: true, data: cartItems };
  } catch (error) {
      console.error("Error fetching user's cart:", error);
      return { success: false, error: error.message };
  }
};

export const removeFromCart = async (userId, itemId) => {
  console.log('reached,', userId, itemId);
  try {
    const client = await clientPromise;
    const db = client.db('eCommerceDB');

    // Assuming userId is ObjectId but itemId is a string
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },  // Keep userId as ObjectId
      { $pull: { cart: { _id: itemId } } }  // Treat itemId as a string
    );

    console.log('Removed item from cart:', result);

    return { success: true, data: result };
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return { success: false, error: error.message };
  }
};

// Place an order
export const placeOrder = async (userId, orderDetails) => {
    try {
        const client = await clientPromise;
        const db = client.db("eCommerceDB");

        const result = await db.collection("orders").insertOne({
            userId: new ObjectId(userId),
            orderDetails,
            createdAt: new Date(),
        });
        console.log("Order placed:", result);

        return { success: true, data: result };
    } catch (error) {
        console.error("Error placing order:", error);
        return { success: false, error: error.message };
    }
};

// Fetch user's orders
export const getUserOrders = async (userId) => {
    try {
        const client = await clientPromise;
        const db = client.db("eCommerceDB");

        const orders = await db.collection("orders").find({ userId: new ObjectId(userId) }).toArray();
        console.log("Fetched user's orders:", orders);

        return { success: true, data: orders };
    } catch (error) {
        console.error("Error fetching user's orders:", error);
        return { success: false, error: error.message };
    }
};



// Get user's favorites
export const getUserFavorites = async (userId) => {
    try {
      console.log("userId",userId);
        const client = await clientPromise;
        const db = client.db("eCommerceDB");

        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
        console.log("Fetched user's favorites:", user?.favorites);

        return { success: true, data: user?.favorites || [] };
    } catch (error) {
        console.error("Error fetching user's favorites:", error);
        return { success: false, error: error.message };
    }
};

// Remove item from user's favorites
export const removeFromFavorites = async (userId, itemId) => {
    try {
        const client = await clientPromise;
        const db = client.db("eCommerceDB");

        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { favorites: { _id: itemId } } }
        );
        console.log("Removed item from favorites:", result);

        return { success: true, data: result };
    } catch (error) {
        console.error("Error removing item from favorites:", error);
        return { success: false, error: error.message };
    }
};
