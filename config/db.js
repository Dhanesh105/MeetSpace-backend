const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meetspace';

// Atlas connection string as fallback for production
const ATLAS_URI = 'mongodb+srv://dt418105:WTTLjZDxeGpZSIBW@cluster0.e0hav.mongodb.net/meetspace?retryWrites=true&w=majority&appName=Cluster0';

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

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Cache the connection
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error(`Error connecting to primary MongoDB: ${error.message}`);

    // Try connecting to Atlas as fallback in production
    if (process.env.NODE_ENV === 'production') {
      try {
        console.log('Attempting to connect to MongoDB Atlas as fallback...');
        const conn = await mongoose.connect(ATLAS_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          bufferCommands: false,
          maxPoolSize: 10,
        });

        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);

        // Cache the connection
        cachedConnection = conn;
        return conn;
      } catch (atlasError) {
        console.error(`Error connecting to MongoDB Atlas: ${atlasError.message}`);
        throw atlasError;
      }
    } else {
      // In development, exit the process
      console.error('Failed to connect to MongoDB. Exiting...');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
