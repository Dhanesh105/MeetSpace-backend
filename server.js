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

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4321;

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

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
    message: 'MeetSpace API is running',
    documentation: '/api-docs',
    endpoints: {
      // Room endpoints
      getAllRooms: 'GET /api/rooms',
      getRoomById: 'GET /api/rooms/:id',
      getAvailableRooms: 'GET /api/rooms/available?startTime=ISO_DATE&endTime=ISO_DATE',
      getRoomBookings: 'GET /api/rooms/:id/bookings',
      checkRoomAvailability: 'GET /api/rooms/:id/availability?startTime=ISO_DATE&endTime=ISO_DATE',
      createRoom: 'POST /api/rooms',
      updateRoom: 'PUT /api/rooms/:id',
      deleteRoom: 'DELETE /api/rooms/:id',

      // Booking endpoints
      getAllBookings: 'GET /api/bookings',
      getBookingById: 'GET /api/bookings/:id',
      getBookingsForDateRange: 'GET /api/bookings?startDate=ISO_DATE&endDate=ISO_DATE',
      createBooking: 'POST /api/bookings',
      updateBooking: 'PUT /api/bookings/:id',
      deleteBooking: 'DELETE /api/bookings/:id'
    },
    version: '1.0.0'
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

// Start the server if not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for serverless environments (Vercel)
module.exports = app;