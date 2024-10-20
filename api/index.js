'use server'

import clientPromise from "../lib/actions/user/mongodb";

export const addToSpreadSheet = async (data) => {
    try {
      const client = await clientPromise;
      const db = client.db("nextjs-mongodb-demo");
      await db.collection("posts").insertOne(data);
      return { success: true };
    } catch (error) {
      console.error("Error adding data to spreadsheet:", error);
      return { success: false, error: error.message };
    }
  };
  

