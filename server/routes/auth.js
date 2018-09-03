const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../db/user');

const RequestValidator = require('../src/request-schema-validator');
const ResponseService = require('../src/response-service');
const validator = require('../src/validation-helpers');

const router = express.Router();

// --- POST /api/v1/auth/signup ---
// body: {
//   email: 'foo@bar.com',
//   password: 'MoreThan6Char$'
// }
router.post('/signup', (req, res, next) => {
  RequestValidator.validateRequestBody('user', req.body)
    // validate request body against db schema
    .then((missingRequiredProperties) => {
      if (missingRequiredProperties.length > 0) {
        return res.json(ResponseService.badRequest400(req, {
          missing_fields: missingRequiredProperties,
        }));
      }

      const validEmail = validator.isValidEmail(req.body.email);
      const validPass = validator.isValidPassword(req.body.password);

      if (!validEmail) {
        return res.status(400).json(ResponseService.badRequest400(req, {
          invalid_field: 'email',
        }));
      }

      if (!validPass) {
        return res.status(400).json(ResponseService.badRequest400(req, {
          invalid_field: 'password',
        }));
      }

      // if email and password are valid formats
      if (validEmail && validPass) {
        // if email address is unique
        User.getOneByEmail(req.body.email).then((existingUser) => {
          if (existingUser) {
            return res.status(400).json(ResponseService.badRequest400(req, {
              invalid_field: 'email',
              reason: 'unique',
            }));
          }
          // hash password
          bcrypt.hash(req.body.password, 10)
            .then((hash) => {
              const user = {
                email: req.body.email,
                password: hash,
              };
              // insert user int db
              User.create(user).then((id) => {
                res.json(ResponseService.resource(id));
              });
            });
        });
      } else {
        return res.status(400).json(ResponseService.badRequest400());
      }
    })
    .catch((err) => {
      next(err);
    });
});

// POST /api/v1/auth/login
// body: {
//   email: 'foo@bar.com',
//   password: 'FooBar123!'
// }
router.post('/login', (req, res, next) => {
  try {
    const validEmail = validator.isValidEmail(req.body.email);
    const validPass = validator.isValidPassword(req.body.password);

    if (!validEmail) {
      return res.status(400).json(ResponseService.badRequest400({
        invalid_field: 'email',
      }));
    }

    if (!validPass) {
      return res.status(400).json(ResponseService.badRequest400({
        invalid_field: 'password',
      }));
    }

    User.getOneByEmail(req.body.email).then((user) => {
      if (user) {
        console.log(user);
        bcrypt
          .compare(req.body.password, user.password)
          .then((match) => {
            if (match) {
              res.json({
                id: user.id,
                token: 'Bearer 12345',
              });
            } else {
              // Email is valid but passsord does not match
              res.json(ResponseService.badRequest400({}, 'Email and password do not match.'));
            }
          });
      } else {
        res.json(ResponseService.badRequest400({}, 'Could not find a user with provided email address in our system.'));
      }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
