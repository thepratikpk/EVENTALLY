// import mongoose from "mongoose";
// import dotenv from 'dotenv'
// dotenv.config()
// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log("MongoDB connection error:", error);
//   }
// };

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB =async()=>{
  try{
    const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`)
  }catch(error){
    console.log("MONOGODB connection error: ",error)
    process.exit(1);
  }
}

export default connectDB