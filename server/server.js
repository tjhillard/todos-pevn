const express = require('express');
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
app.use((err, req, res, next) => { // eslint-disable-line
  console.error(err);
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {},
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
});

module.exports = app;
