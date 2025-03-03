import mongoose from "mongoose";


const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected");
        });

        mongoose.connection.on("error", (err) => {
            console.log("MongoDB connection error: ", err);
        });

        // Set a connection timeout (e.g., 10 seconds)
        const options = {
            serverSelectionTimeoutMS: 10000, // 10 seconds
        };

        await mongoose.connect(process.env.MONGODB_URI, options);
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
};

export default connectDB;