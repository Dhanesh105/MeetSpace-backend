const Room = require('./Room');

// Find all rooms
exports.findAll = async () => {
  return await Room.find().sort({ name: 1 });
};

// Find room by ID
exports.findById = async (id) => {
  // Try to find by MongoDB _id first
  try {
    const room = await Room.findById(id);
    if (room) return room;
  } catch (e) {
    // If not a valid ObjectId, continue to next approach
    console.log('Not a valid ObjectId, trying roomId field');
  }

  // If not found or not a valid ObjectId, try to find by roomId field
  return await Room.findOne({ roomId: id });
};

// Create new room
exports.create = async (room) => {
  const newRoom = new Room(room);
  return await newRoom.save();
};

// Update room
exports.update = async (id, updatedRoom) => {
  const room = await Room.findByIdAndUpdate(
    id,
    { ...updatedRoom, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );
  return room;
};

// Delete room
exports.delete = async (id) => {
  const result = await Room.findByIdAndDelete(id);
  return result !== null;
};

// Check room availability for a specific time period
exports.checkAvailability = async (roomId, startTime, endTime, excludeBookingId = null) => {
  // First check if the room exists
  const room = await Room.findById(roomId);
  if (!room) {
    return { available: false, error: 'Room not found' };
  }

  if (!room.isAvailable) {
    return { available: false, error: 'Room is not available for booking' };
  }

  // Check for overlapping bookings
  const Booking = require('./Booking');
  const query = {
    roomId,
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) }
  };

  // Exclude the current booking when checking for updates
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const count = await Booking.countDocuments(query);

  if (count > 0) {
    return {
      available: false,
      error: 'Room is already booked during this time period'
    };
  }

  return { available: true };
};

// Find available rooms for a specific time period
exports.findAvailable = async (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Get all rooms that are generally available
  const allRooms = await Room.find({ isAvailable: true });

  // Get all bookings that overlap with the requested time
  const Booking = require('./Booking');
  const overlappingBookings = await Booking.find({
    startTime: { $lt: end },
    endTime: { $gt: start }
  });

  // Extract room IDs from overlapping bookings
  const bookedRoomIds = overlappingBookings.map(booking => booking.roomId);

  // Filter out rooms that are already booked
  return allRooms.filter(room => !bookedRoomIds.includes(room._id.toString()));
};
