// Libraries
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Controllers
const User = require('../controllers/UserController');
// Validation Middleware
const { loginValidator, signUpValidator } = require('../middleware/validation/auth');
// Services
const ResponseService = require('../services/response-service');

const router = express.Router();

// --- POST /api/v1/auth/signup ---
// body: {
//   email: 'foo@bar.com',
//   password: 'MoreThan6Char$'
// }
router.post('/signup', signUpValidator, (req, res, next) => {
  // hash password
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = {
        email: req.body.email,
        password: hash,
      };
      // insert user int db
      User.create(user).then((id) => {
        if (id) {
          user.password = undefined;
          // Generate JWT
          jwt.sign(user, 'secret', { expiresIn: '7d' }, (err, token) => {
            if (err) {
              next(err);
            }
            res.json({
              id,
              token,
            });
          });
        }
      });
    }).catch((err) => {
      next(err);
    });
});

// POST /api/v1/auth/login
// body: {
//   email: 'foo@bar.com',
//   password: 'FooBar123!'
// }
router.post('/login', loginValidator, (req, res, next) => {
  User.getOneByEmail(req.body.email)
    .then((user) => {
      if (user) {
        bcrypt
          .compare(req.body.password, user.password)
          .then((match) => {
            if (match) {
              user.password = undefined;
              // Generate JWT
              jwt.sign(user, 'secret', { expiresIn: '7d' }, (err, token) => {
                if (err) {
                  next(err);
                }
                res.json({
                  id: user.id,
                  token,
                });
              });
            } else {
              // Email is valid but passsord does not match
              res.status(400).json(ResponseService.badRequest400({}, 'Email and password do not match.'));
            }
          })
          .catch((err) => {
            next(err);
          });
      } else {
        res.status(400).json(ResponseService.badRequest400({}, 'Could not find a user with provided email address in our system.'));
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
