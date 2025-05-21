const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  // Add a custom string ID field
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  features: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
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
RoomSchema.index({ name: 1 });

module.exports = mongoose.model('Room', RoomSchema);
