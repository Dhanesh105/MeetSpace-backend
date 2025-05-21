const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookings');
const roomRoutes = require('./routes/rooms');
const setupSwagger = require('./swagger');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4321;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);

// For backward compatibility
app.use('/bookings', bookingRoutes);
app.use('/rooms', roomRoutes);

// Setup Swagger documentation
setupSwagger(app);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Meeting Room Booking API is running',
    endpoints: {
      // Room endpoints
      getAllRooms: 'GET /rooms',
      getRoomById: 'GET /rooms/:roomId',
      getAvailableRooms: 'GET /rooms/available?startTime=ISO_DATE&endTime=ISO_DATE',
      getRoomBookings: 'GET /rooms/:roomId/bookings',
      checkRoomAvailability: 'GET /rooms/:roomId/availability?startTime=ISO_DATE&endTime=ISO_DATE',
      createRoom: 'POST /rooms',
      updateRoom: 'PUT /rooms/:roomId',
      deleteRoom: 'DELETE /rooms/:roomId',

      // Booking endpoints
      getAllBookings: 'GET /bookings',
      getBookingById: 'GET /bookings/:bookingId',
      createBooking: 'POST /bookings',
      updateBooking: 'PUT /bookings/:bookingId',
      deleteBooking: 'DELETE /bookings/:bookingId'
    }
  });
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start the server after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });