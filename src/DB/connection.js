import mongoose from "mongoose";

const connectDB = async (req, res) => {
  await mongoose
    .connect(process.env.CONNECTION_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export default connectDB;
