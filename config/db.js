const mongoose = require('mongoose');

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dt418105:WTTLjZDxeGpZSIBW@cluster0.e0hav.mongodb.net/meetspace?retryWrites=true&w=majority&appName=Cluster0';

// Cache the database connection
let cachedConnection = null;

// Connect to MongoDB
const connectDB = async () => {
  // If we have a cached connection, use it
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    // Set strictQuery to false to prepare for Mongoose 7
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);

    // Cache the connection
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);

    // In production, don't exit the process as it will crash the serverless function
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }

    throw error;
  }
};

module.exports = connectDB;
