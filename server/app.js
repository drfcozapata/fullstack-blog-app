const express = require('express');
const cors = require('cors');

// Controllers
const { globalErrorsHandler } = require('./controllers/errors.controller');

// Routers
const { usersRouter } = require('./routes/users.routes');
const { postsRouter } = require('./routes/posts.routes');

// Init express app
const app = express();

// Enable CORS
app.use(cors());

// Enable incoming JSON data
app.use(express.json());

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postsRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Global Error Handler
app.use('*', globalErrorsHandler);

module.exports = { app };
