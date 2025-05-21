const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  roomId: {
    type: String,
    required: [true, 'Room ID is required'],
    ref: 'Room'
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  attendees: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Create index for faster queries
BookingSchema.index({ roomId: 1, startTime: 1, endTime: 1 });

// Static method to check for overlapping bookings
BookingSchema.statics.checkOverlap = async function(roomId, startTime, endTime, excludeId = null) {
  const query = {
    roomId,
    $or: [
      // Case 1: Booking starts within the range
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
    ]
  };

  // Exclude the current booking when checking for updates
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const count = await this.countDocuments(query);
  return count > 0;
};

module.exports = mongoose.model('Booking', BookingSchema);
