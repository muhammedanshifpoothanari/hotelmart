'use server'

import clientPromise from "../user/mongodb";



// Fetch all products
export const getProductsFromDatabase = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("hotelBakenjoy");

    const products = await db.collection("products").find().toArray();
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products from database:", error);
    return { success: false, error: error.message };
  }
};


import { ObjectId } from "mongodb";

// Fetch product by ID
export const getProductsFromDatabaseById = async (id) => {
  try {
    console.log("Product ID:", id);
    const client = await clientPromise;
    const db = client.db("hotelBakenjoy");

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    console.log("Fetched Product:", product);

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product from database:", error);
    return { success: false, error: error.message };
  }
};






export const getProductsFromDatabaseForHomeScreen = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("hotelBakenjoy");

    // Get the current date
    const currentDate = new Date();

    // Query to fetch products where offerEnd is less than or equal to today's date, limit to 2 results
    const offerEndingProducts = await db.collection("products")
      .find({
        offerEnd: { $lte: currentDate } // offerEnd is less than or equal to the current date
      })
      .limit(2)  // Limit to 2 products
      .toArray();

    // Query to fetch all best-selling products
    const bestSellingProducts = await db.collection("products")
      .find({
        isBestSeller: true // Only products marked as best-selling
      })
      .toArray();

    // Combine the results into a single object
    return { 
      success: true, 
      data: {
        offerEndingProducts, 
        bestSellingProducts 
      } 
    };
  } catch (error) {
    console.error("Error fetching products from database:", error);
    return { success: false, error: error.message };
  }
};
