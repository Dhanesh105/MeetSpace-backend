const mongoose = require('mongoose');

// MongoDB connection string
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

    // Wait for the connection to be established before proceeding
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: true, // Allow buffering commands until connection is established
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 30000, // Give enough time for server selection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Cache the connection
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);

    // In production, don't exit the process as it will crash the serverless function
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }

    throw error;
  }
};

module.exports = connectDB;
