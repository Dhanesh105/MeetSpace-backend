const express = require('express');
const roomController = require('../controllers/roomController');
const { validateRoom } = require('../middleware/validation');

const router = express.Router();

// GET all rooms
router.get('/', roomController.getAllRooms);

// GET available rooms for a time period
router.get('/available', roomController.findAvailableRooms);

// GET room by ID
router.get('/:roomId', roomController.getRoomById);

// GET room bookings
router.get('/:roomId/bookings', roomController.getRoomBookings);

// GET room availability
router.get('/:roomId/availability', roomController.checkRoomAvailability);

// POST create new room
router.post('/', validateRoom, roomController.createRoom);

// PUT update room
router.put('/:roomId', validateRoom, roomController.updateRoom);

// DELETE room
router.delete('/:roomId', roomController.deleteRoom);

module.exports = router;
