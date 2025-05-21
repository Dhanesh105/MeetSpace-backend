const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4321;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample data
const bookings = [
  {
    id: '1a2b3c4d',
    userId: 'john.doe',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 90 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString()
  },
  {
    id: '2b3c4d5e',
    userId: 'jane.smith',
    startTime: new Date(Date.now() + 3 * 60 * 60000).toISOString(),
    endTime: new Date(Date.now() + 4 * 60 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString()
  }
];

// Routes
app.get('/bookings', (req, res) => {
  res.status(200).json({
    success: true,
    data: bookings
  });
});

app.get('/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }
  res.status(200).json({
    success: true,
    data: booking
  });
});

app.post('/bookings', (req, res) => {
  const { userId, startTime, endTime } = req.body;
  
  if (!userId || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }
  
  const newBooking = {
    id: Math.random().toString(36).substring(2, 10),
    userId,
    startTime,
    endTime,
    createdAt: new Date().toISOString()
  };
  
  bookings.push(newBooking);
  
  res.status(201).json({
    success: true,
    data: newBooking
  });
});

app.put('/bookings/:id', (req, res) => {
  const { userId, startTime, endTime } = req.body;
  const index = bookings.findIndex(b => b.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }
  
  if (!userId || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }
  
  const updatedBooking = {
    ...bookings[index],
    userId,
    startTime,
    endTime,
    updatedAt: new Date().toISOString()
  };
  
  bookings[index] = updatedBooking;
  
  res.status(200).json({
    success: true,
    data: updatedBooking
  });
});

app.delete('/bookings/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }
  
  bookings.splice(index, 1);
  
  res.status(200).json({
    success: true,
    message: 'Booking deleted successfully'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Calendar Booking API is running',
    endpoints: {
      getAllBookings: 'GET /bookings',
      getBookingById: 'GET /bookings/:id',
      createBooking: 'POST /bookings',
      updateBooking: 'PUT /bookings/:id',
      deleteBooking: 'DELETE /bookings/:id'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
