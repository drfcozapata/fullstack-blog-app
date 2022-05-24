const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Controllers
const { globalErrorsHandler } = require('./controllers/errors.controller');

// Routers
const { usersRouter } = require('./routes/users.routes');
const { postsRouter } = require('./routes/posts.routes');
const { commentsRouter } = require('./routes/comments.routes');
const { viewsRouter } = require('./routes/views.routes');

// Init express app
const app = express();

// Enable CORS
app.use(cors());

// Enable incoming JSON data
app.use(express.json());

// Enable incoming form-data
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Limit IP requests
const limiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1h
  max: 10000,
  message: 'Too many requests from this IP',
});
app.use(limiter);

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/comments', commentsRouter);
app.use('/', viewsRouter);

// Global Error Handler
app.use('*', globalErrorsHandler);

module.exports = { app };
