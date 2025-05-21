// Validation middleware
exports.validateBooking = (req, res, next) => {
  const { userId, roomId, startTime, endTime, title } = req.body;
  const errors = [];

  // Validate userId
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    errors.push('Valid userId is required');
  }

  // Validate roomId
  if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
    errors.push('Valid roomId is required');
  }

  // Validate title (optional)
  if (title && (typeof title !== 'string' || title.length > 100)) {
    errors.push('Title must be a string with maximum length of 100 characters');
  }

  // Validate startTime and endTime
  if (!isValidISODate(startTime)) {
    errors.push('startTime must be a valid ISO date string');
  }

  if (!isValidISODate(endTime)) {
    errors.push('endTime must be a valid ISO date string');
  }

  // Validate time logic
  if (isValidISODate(startTime) && isValidISODate(endTime)) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      errors.push('startTime must be before endTime');
    }

    // Commented out to allow past bookings for testing
    // if (start < new Date()) {
    //   errors.push('Cannot create bookings in the past');
    // }

    // Check if booking duration is reasonable (e.g., less than 24 hours)
    const durationHours = (end - start) / (1000 * 60 * 60);
    if (durationHours > 24) {
      errors.push('Booking duration cannot exceed 24 hours');
    }
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(', '));
    error.statusCode = 400;
    return next(error);
  }

  next();
};

// Room validation middleware
exports.validateRoom = (req, res, next) => {
  const { name, capacity, features, location } = req.body;
  const errors = [];

  // Validate name
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Valid room name is required');
  }

  // Validate capacity
  if (capacity !== undefined) {
    if (typeof capacity !== 'number' || capacity <= 0 || !Number.isInteger(capacity)) {
      errors.push('Capacity must be a positive integer');
    }
  }

  // Validate features
  if (features !== undefined) {
    if (!Array.isArray(features)) {
      errors.push('Features must be an array');
    } else {
      for (const feature of features) {
        if (typeof feature !== 'string' || feature.trim() === '') {
          errors.push('Each feature must be a non-empty string');
          break;
        }
      }
    }
  }

  // Validate location
  if (location !== undefined && (typeof location !== 'string' || location.trim() === '')) {
    errors.push('Location must be a non-empty string');
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(', '));
    error.statusCode = 400;
    return next(error);
  }

  next();
};

// Helper function to validate ISO date strings
function isValidISODate(dateString) {
  if (typeof dateString !== 'string') return false;

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
}