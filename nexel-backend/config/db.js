import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔌 Attempting to connect to MongoDB...");
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };
    
    await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log("✅ MongoDB connected successfully");
    
    // Log when MongoDB is disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB disconnected');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Retry the connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
