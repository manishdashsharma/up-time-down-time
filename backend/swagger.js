import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title : "Up Time Down Time Documentation",
        description: "Up-Time-Down-Time is a comprehensive project designed to monitor website uptime and downtime"
    },
    "servers": [
        {
          "url": "http://localhost:5000/",
          "description": "Local server"
        },
        {
          "url": "https://up-time-down-time.vercel.app/",
          "description": "Production server"
        }
      ],
      "tags": [
        {
          "name": "Health Check",
          "description": "Endpoints related to system health check"
        },
        {
          "name": "Authentication",
          "description": "Endpoints related to user authentication"
        }
      ],
}

const outputFile = './swagger.json'
const route = ["./src/routes/index.js"]

swaggerAutogen(outputFile, route,doc)