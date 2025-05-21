const Booking = require('./Booking');

// Find all bookings
exports.findAll = async () => {
  try {
    return await Booking.find().sort({ startTime: 1 });
  } catch (error) {
    console.error('Error in findAll:', error);
    throw error;
  }
};

// Find booking by ID
exports.findById = async (id) => {
  try {
    return await Booking.findById(id);
  } catch (error) {
    console.error('Error in findById:', error);
    throw error;
  }
};

// Create new booking
exports.create = async (booking) => {
  const newBooking = new Booking(booking);
  return await newBooking.save();
};

// Update booking
exports.update = async (id, updatedBooking) => {
  const booking = await Booking.findByIdAndUpdate(
    id,
    { ...updatedBooking, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );
  return booking;
};

// Delete booking
exports.delete = async (id) => {
  const result = await Booking.findByIdAndDelete(id);
  return result !== null;
};

// Check for overlapping bookings
exports.checkOverlap = async (roomId, startTime, endTime, excludeId = null) => {
  const query = {
    roomId,
    $or: [
      // Booking overlaps with the requested time
      {
        startTime: { $lt: new Date(endTime) },
        endTime: { $gt: new Date(startTime) }
      }
    ]
  };

  // Exclude the current booking when checking for updates
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const count = await Booking.countDocuments(query);
  return count > 0;
};

// Find bookings for a specific room
exports.findByRoomId = async (roomId) => {
  return await Booking.find({ roomId }).sort({ startTime: 1 });
};

// Find bookings for a specific user
exports.findByUserId = async (userId) => {
  return await Booking.find({ userId }).sort({ startTime: 1 });
};

// Find bookings for a specific time range
exports.findByTimeRange = async (startTime, endTime) => {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    console.log(`Finding bookings between ${start.toISOString()} and ${end.toISOString()}`);

    return await Booking.find({
      $or: [
        // Booking starts within the range
        { startTime: { $gte: start, $lte: end } },
        // Booking ends within the range
        { endTime: { $gte: start, $lte: end } },
        // Booking spans the entire range
        { startTime: { $lte: start }, endTime: { $gte: end } }
      ]
    }).sort({ startTime: 1 });
  } catch (error) {
    console.error('Error in findByTimeRange:', error);
    throw error;
  }
};