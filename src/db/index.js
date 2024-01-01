import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`MongoDB Conenciton Successful !! /n MongoDB Host = ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB Conenction error",error);
    process.exit(1)
  }
}

export default connectDB;