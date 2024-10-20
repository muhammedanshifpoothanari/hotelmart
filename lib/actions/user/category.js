// actions/user/banner.js
'use server'

import clientPromise from "../user/mongodb";


import { ObjectId } from "mongodb";

// Fetch product by ID
export const getCategoriesFromDatabaseById = async (id) => {
  try {
    console.log("Product ID:", id);
    const client = await clientPromise;
    const db = client.db("hotelBakenjoy");

    const categories = await db.collection("categories").findOne({ _id: new ObjectId(id) });
    console.log("Fetched Product:", categories);

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories from database:", error);
    return { success: false, error: error.message };
  }
};
// Get all categories
export const getCategoriesFromDatabase = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("hotelBakenjoy");

    const categories = await db.collection("categories").find().toArray();
    return { success: true, data: categories };  // Return all categories with subcategories
  } catch (error) {
    console.error("Error fetching categories from database:", error);
    return { success: false, error: error.message };
  }
};





export const getProductsByCriteria = async ({ category, subcategory, isBestSelling, isOfferList }) => {
  try {
    const client = await clientPromise;
    const db = client.db("hotelBakenjoy");

    const query = {};

    // Apply category filter, if provided
    if (category) {
      query.category = category; // Use category field to filter by category
    }

    // Apply subcategory filter independently
    if (subcategory) {
      query.subCategory = subcategory; // Ensure the field name matches your MongoDB field (subCategory)
    }

    // Apply best-selling filter, if provided
    if (isBestSelling) {
      query.isBestSeller = true;
    }

    // Apply offer list filter, if provided
    if (isOfferList) {
      const currentDate = new Date();
      query.offerEnd = { $gte: currentDate }; // Assuming an offerEnd field representing offer expiration
    }

    // Fetch products based on the constructed query
    const products = await db.collection("products").find(query).toArray();
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products from database:", error);
    return { success: false, error: error.message };
  }
};
