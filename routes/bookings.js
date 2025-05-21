const express = require('express');
const bookingController = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validation');

const router = express.Router();

// GET all bookings
router.get('/', bookingController.getAllBookings);

// GET booking by ID
router.get('/:bookingId', bookingController.getBookingById);

// POST create new booking
router.post('/', validateBooking, bookingController.createBooking);

// Optional: PUT update booking
router.put('/:bookingId', validateBooking, bookingController.updateBooking);

// Optional: DELETE booking
router.delete('/:bookingId', bookingController.deleteBooking);

module.exports = router;