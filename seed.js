const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Sample rooms data
const roomsData = [
  {
    roomId: 'room1',
    name: 'Conference Room A',
    capacity: 10,
    features: ['projector', 'whiteboard', 'video-conferencing'],
    location: 'Floor 1',
    imageUrl: 'https://example.com/room-a.jpg',
    isAvailable: true
  },
  {
    roomId: 'room2',
    name: 'Meeting Room B',
    capacity: 6,
    features: ['whiteboard', 'video-conferencing'],
    location: 'Floor 1',
    imageUrl: 'https://example.com/room-b.jpg',
    isAvailable: true
  },
  {
    roomId: 'room3',
    name: 'Board Room',
    capacity: 20,
    features: ['projector', 'whiteboard', 'video-conferencing', 'catering'],
    location: 'Floor 2',
    imageUrl: 'https://example.com/board-room.jpg',
    isAvailable: true
  },
  {
    roomId: 'room4',
    name: 'Small Meeting Room',
    capacity: 4,
    features: ['whiteboard'],
    location: 'Floor 2',
    imageUrl: 'https://example.com/small-room.jpg',
    isAvailable: true
  },
  {
    roomId: 'room5',
    name: 'Collaboration Space',
    capacity: 8,
    features: ['whiteboard', 'video-conferencing'],
    location: 'Floor 3',
    imageUrl: 'https://example.com/collab-space.jpg',
    isAvailable: true
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await Room.deleteMany({});
    await Booking.deleteMany({});

    console.log('Previous data cleared');

    // Insert rooms
    const createdRooms = await Room.insertMany(roomsData);
    console.log(`${createdRooms.length} rooms inserted`);

    // Create sample bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const bookingsData = [
      {
        userId: 'john.doe',
        roomId: createdRooms[0].roomId, // Use the string roomId instead of _id
        title: 'Team Meeting',
        description: 'Weekly team sync-up',
        startTime: new Date(today.setHours(9, 0, 0, 0)),
        endTime: new Date(today.setHours(10, 30, 0, 0)),
        attendees: 8,
        status: 'confirmed'
      },
      {
        userId: 'jane.smith',
        roomId: createdRooms[1].roomId, // Use the string roomId instead of _id
        title: 'Client Call',
        description: 'Discussion about new project requirements',
        startTime: new Date(today.setHours(13, 0, 0, 0)),
        endTime: new Date(today.setHours(14, 0, 0, 0)),
        attendees: 4,
        status: 'confirmed'
      },
      {
        userId: 'bob.johnson',
        roomId: createdRooms[2].roomId, // Use the string roomId instead of _id
        title: 'Board Meeting',
        description: 'Quarterly board meeting',
        startTime: new Date(tomorrow.setHours(11, 0, 0, 0)),
        endTime: new Date(tomorrow.setHours(12, 0, 0, 0)),
        attendees: 15,
        status: 'confirmed'
      },
      {
        userId: 'alice.williams',
        roomId: createdRooms[3].roomId, // Use the string roomId instead of _id
        title: 'Interview',
        description: 'Interview with developer candidate',
        startTime: new Date(yesterday.setHours(15, 0, 0, 0)),
        endTime: new Date(yesterday.setHours(16, 30, 0, 0)),
        attendees: 3,
        status: 'completed'
      }
    ];

    const createdBookings = await Booking.insertMany(bookingsData);
    console.log(`${createdBookings.length} bookings inserted`);

    console.log('Database seeded successfully');

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
