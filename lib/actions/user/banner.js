// actions/user/banner.js
'use server'

import clientPromise from "../user/mongodb";




import { ObjectId } from "mongodb";

// Fetch product by ID
export const getBannersFromDatabaseById = async (id) => {
  try {
    console.log("Product ID:", id);
    const client = await clientPromise;
    const db = client.db("hotelBakenjoy");

    const banners = await db.collection("banners").findOne({ _id: new ObjectId(id) });
    console.log("Fetched banners:", banners);

    return { success: true, data: banners };
  } catch (error) {
    console.error("Error fetching product from database:", error);
    return { success: false, error: error.message };
  }
};




export const getBannersFromDatabase = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("hotelBakenjoy");

    // Get the current date
    const currentDate = new Date();

    // Query to fetch banners where endDate is either null or greater than the current date
    const banners = await db.collection("banners")
      .find({
        $or: [
          { endDate: { $gt: currentDate } },  // endDate is greater than the current date
          { endDate: null }                   // or no endDate specified
        ]
      })
      .toArray();

    return { success: true, data: banners };
  } catch (error) {
    console.error("Error fetching banners from database:", error);
    return { success: false, error: error.message };
  }
};



