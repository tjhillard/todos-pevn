const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../controllers/UserController');
const { loginValidator, signUpValidator } = require('../middleware/validation/auth');
const RespondWith = require('../services/response-service');
const { jwtSecret, jwtSignatureOptions } = require('../services/jwt-service');

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
          jwt.sign(user, jwtSecret, jwtSignatureOptions, (err, token) => {
            if (err) {
              next(err);
            }
            if (token) {
              return res.json({
                id,
                token,
              });
            }
            RespondWith.internal500(); // just in case
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
              jwt.sign(user, jwtSecret, jwtSignatureOptions, (err, token) => {
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
              res.status(400).json(RespondWith.badRequest400({}, 'Email and password do not match.'));
            }
          })
          .catch((err) => {
            next(err);
          });
      } else {
        res.status(400).json(RespondWith.badRequest400({}, 'Could not find a user with provided email address in our system.'));
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
