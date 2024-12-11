import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_CONNECTION_STRING
    );
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection error: " + error);
    process.exit(1);
  }
};

export default dbConnect;
