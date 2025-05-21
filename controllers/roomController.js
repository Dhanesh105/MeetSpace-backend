const { v4: uuidv4 } = require('uuid');
const roomModel = require('../models/roomModel');
const bookingModel = require('../models/bookingModel');

// Get all rooms
exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await roomModel.findAll();
    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

// Get room by ID
exports.getRoomById = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await roomModel.findById(roomId);

    if (!room) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// Create new room
exports.createRoom = async (req, res, next) => {
  try {
    const { name, capacity, features, location } = req.body;

    const newRoom = {
      name,
      capacity: parseInt(capacity, 10),
      features: features || [],
      location: location || '',
      isAvailable: true,
      createdAt: new Date().toISOString()
    };

    await roomModel.create(newRoom);

    res.status(201).json({
      success: true,
      data: newRoom
    });
  } catch (error) {
    next(error);
  }
};

// Update room
exports.updateRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { name, capacity, features, location } = req.body;

    // Check if room exists
    const existingRoom = await roomModel.findById(roomId);
    if (!existingRoom) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedRoom = {
      ...existingRoom,
      name: name || existingRoom.name,
      capacity: capacity || existingRoom.capacity,
      features: features || existingRoom.features,
      location: location || existingRoom.location,
      updatedAt: new Date().toISOString()
    };

    await roomModel.update(roomId, updatedRoom);

    res.status(200).json({
      success: true,
      data: updatedRoom
    });
  } catch (error) {
    next(error);
  }
};

// Delete room
exports.deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    // Check if room exists
    const existingRoom = await roomModel.findById(roomId);
    if (!existingRoom) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if there are any bookings for this room
    const roomBookings = await bookingModel.findByRoomId(roomId);
    if (roomBookings.length > 0) {
      const error = new Error('Cannot delete room with existing bookings');
      error.statusCode = 409; // Conflict
      throw error;
    }

    await roomModel.delete(roomId);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Check room availability
exports.checkRoomAvailability = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      const error = new Error('startTime and endTime are required');
      error.statusCode = 400;
      throw error;
    }

    const availability = await roomModel.checkAvailability(
      roomId,
      startTime,
      endTime
    );

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

// Get room bookings
exports.getRoomBookings = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    // Check if room exists
    const room = await roomModel.findById(roomId);
    if (!room) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }

    const bookings = await bookingModel.findByRoomId(roomId);

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// Find available rooms
exports.findAvailableRooms = async (req, res, next) => {
  try {
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      const error = new Error('startTime and endTime are required');
      error.statusCode = 400;
      throw error;
    }

    const availableRooms = await roomModel.findAvailable(
      startTime,
      endTime
    );

    res.status(200).json({
      success: true,
      data: availableRooms
    });
  } catch (error) {
    next(error);
  }
};
