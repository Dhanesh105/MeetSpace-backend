# MeetSpace Backend

This is the backend server for the MeetSpace application, a modern meeting room booking system.

## Features

- RESTful API for managing room bookings
- MongoDB integration for data storage
- JWT authentication for secure access
- Swagger documentation for API endpoints
- Input validation middleware

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JSON Web Tokens (JWT)
- Swagger UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dhanesh105/MeetSpace-backend.git
   cd MeetSpace-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=4322
   MONGODB_URI=mongodb+srv://dt418105:WTTLjZDxeGpZSIBW@cluster0.e0hav.mongodb.net/meetspace?retryWrites=true&w=majority&appName=Cluster0
   ```

4. Start the server:
   ```bash
   npm start
   ```

### API Documentation

Once the server is running, you can access the Swagger documentation at:
```
https://meet-space-backend-1.vercel.app/api-docs
```

## API Endpoints

### Rooms

- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get a specific room
- `POST /api/rooms` - Create a new room
- `PUT /api/rooms/:id` - Update a room
- `DELETE /api/rooms/:id` - Delete a room

### Bookings

- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get a specific booking
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Delete a booking

## Data Models

### Room

```javascript
{
  name: String,
  capacity: Number,
  floor: Number,
  amenities: [String],
  isAvailable: Boolean
}
```

### Booking

```javascript
{
  roomId: ObjectId,
  title: String,
  description: String,
  startTime: Date,
  endTime: Date,
  attendees: [String],
  createdBy: String
}
```

## Development

### Seeding the Database

To populate the database with sample data:

```bash
node seed.js
```

### Running in Development Mode

```bash
npm run dev
```

## Deployment

The backend is deployed on Vercel at:
```
https://meet-space-backend-1.vercel.app
```

## License

This project is licensed under the MIT License.
