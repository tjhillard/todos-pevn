const express = require('express');
const jwt = require('express-jwt');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authRouter = require('./routes/auth');
const todosRouter = require('./routes/todos');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist/')));

/* API Middleware */
app.use(jwt({ secret: 'secret' }).unless({ path: ['/api/v1/auth/login', '/api/v1/auth/signup'] }));
app.use('/api', (req, res, next) => {
  next();
});

/* Routes */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/todos', todosRouter);

/* Error Handlers */
// auth error
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: true,
      name: err.name,
      message: err.message,
      details: {
        status: err.status,
        code: err.code,
        inner: err.inner,
      },
    });
  }
});
// unknown error fallback
app.use((err, req, res) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: true,
    name: 'UncaughtException',
    message: err.message,
    details: process.env.NODE_ENV === 'development' ? err : {},
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
});

module.exports = app;
