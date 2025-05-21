const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MeetSpace API',
      version: '1.0.0',
      description: 'API for the MeetSpace meeting room booking system',
      contact: {
        name: 'API Support',
        email: 'support@meetspace.example.com'
      }
    },
    servers: [
      {
        url: 'https://meetspace-backend.vercel.app',
        description: 'Production server'
      },
      {
        url: 'http://localhost:4321',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Room: {
          type: 'object',
          required: ['name', 'capacity'],
          properties: {
            id: {
              type: 'string',
              description: 'Room ID'
            },
            name: {
              type: 'string',
              description: 'Room name'
            },
            capacity: {
              type: 'integer',
              description: 'Maximum number of people'
            },
            features: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Room features (e.g., projector, whiteboard)'
            },
            location: {
              type: 'string',
              description: 'Room location (e.g., floor, building)'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Booking: {
          type: 'object',
          required: ['userId', 'roomId', 'startTime', 'endTime'],
          properties: {
            id: {
              type: 'string',
              description: 'Booking ID'
            },
            userId: {
              type: 'string',
              description: 'User ID who made the booking'
            },
            roomId: {
              type: 'string',
              description: 'Room ID being booked'
            },
            title: {
              type: 'string',
              description: 'Booking title'
            },
            description: {
              type: 'string',
              description: 'Booking description'
            },
            startTime: {
              type: 'string',
              format: 'date-time',
              description: 'Booking start time'
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              description: 'Booking end time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string'
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Invalid input data'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Resource not found'
              }
            }
          }
        },
        Conflict: {
          description: 'Conflict with existing resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Resource already exists or conflicts with another resource'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Rooms',
        description: 'Room management endpoints'
      },
      {
        name: 'Bookings',
        description: 'Booking management endpoints'
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

function setupSwagger(app) {
  // Serve swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Serve swagger spec as JSON
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Swagger documentation available at /api-docs');
}

module.exports = setupSwagger;
