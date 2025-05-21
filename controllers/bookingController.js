const { v4: uuidv4 } = require('uuid');
const bookingModel = require('../models/bookingModel');

// Get all bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    const { startTime, endTime } = req.query;

    // If startTime and endTime are provided, get bookings for that range
    if (startTime && endTime) {
      const bookings = await bookingModel.findByTimeRange(startTime, endTime);
      res.status(200).json({
        success: true,
        data: bookings
      });
    } else {
      // Otherwise, get all bookings
      const bookings = await bookingModel.findAll();
      res.status(200).json({
        success: true,
        data: bookings
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
exports.getBookingById = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// Create new booking
exports.createBooking = async (req, res, next) => {
  try {
    const { userId, roomId, title, description, startTime, endTime } = req.body;

    // Validate room exists
    const roomModel = require('../models/roomModel');
    const room = await roomModel.findById(roomId);
    if (!room) {
      const error = new Error(`Room not found with ID: ${roomId}`);
      error.statusCode = 404;
      throw error;
    }

    // Use the roomId string field for consistency
    const actualRoomId = room.roomId || roomId;

    // Check for overlapping bookings for this room
    const hasOverlap = await bookingModel.checkOverlap(actualRoomId, startTime, endTime);
    if (hasOverlap) {
      const error = new Error('Room is already booked during this time period');
      error.statusCode = 409; // Conflict
      throw error;
    }

    // Validate time logic
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      const error = new Error('End time must be after start time');
      error.statusCode = 400;
      throw error;
    }

    if (start < new Date()) {
      const error = new Error('Cannot book a room in the past');
      error.statusCode = 400;
      throw error;
    }

    const newBooking = {
      id: uuidv4(),
      userId,
      roomId: actualRoomId, // Use the consistent roomId
      title: title || 'Untitled Meeting',
      description: description || '',
      startTime,
      endTime,
      createdAt: new Date().toISOString()
    };

    await bookingModel.create(newBooking);

    res.status(201).json({
      success: true,
      data: newBooking
    });
  } catch (error) {
    next(error);
  }
};

// Update booking
exports.updateBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { userId, roomId, title, description, startTime, endTime } = req.body;

    // Check if booking exists
    const existingBooking = await bookingModel.findById(bookingId);
    if (!existingBooking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    // If room is being changed, validate new room exists
    let actualRoomId = existingBooking.roomId;

    if (roomId && roomId !== existingBooking.roomId) {
      const roomModel = require('../models/roomModel');
      const room = await roomModel.findById(roomId);
      if (!room) {
        const error = new Error(`Room not found with ID: ${roomId}`);
        error.statusCode = 404;
        throw error;
      }
      // Use the roomId string field for consistency
      actualRoomId = room.roomId || roomId;
    }

    // Determine which room to check for conflicts
    const roomToCheck = actualRoomId;

    // Check for overlapping bookings (excluding this booking)
    const hasOverlap = await bookingModel.checkOverlap(
      roomToCheck,
      startTime || existingBooking.startTime,
      endTime || existingBooking.endTime,
      bookingId
    );

    if (hasOverlap) {
      const error = new Error('Room is already booked during this time period');
      error.statusCode = 409; // Conflict
      throw error;
    }

    // Validate time logic if times are being updated
    if (startTime || endTime) {
      const start = new Date(startTime || existingBooking.startTime);
      const end = new Date(endTime || existingBooking.endTime);

      if (start >= end) {
        const error = new Error('End time must be after start time');
        error.statusCode = 400;
        throw error;
      }

      if (start < new Date() && start.toISOString() !== existingBooking.startTime) {
        const error = new Error('Cannot book a room in the past');
        error.statusCode = 400;
        throw error;
      }
    }

    const updatedBooking = {
      ...existingBooking,
      userId: userId || existingBooking.userId,
      roomId: actualRoomId, // Use the consistent roomId
      title: title || existingBooking.title,
      description: description !== undefined ? description : existingBooking.description,
      startTime: startTime || existingBooking.startTime,
      endTime: endTime || existingBooking.endTime,
      updatedAt: new Date().toISOString()
    };

    await bookingModel.update(bookingId, updatedBooking);

    res.status(200).json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// Delete booking
exports.deleteBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    // Check if booking exists
    const existingBooking = await bookingModel.findById(bookingId);
    if (!existingBooking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    await bookingModel.delete(bookingId);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};