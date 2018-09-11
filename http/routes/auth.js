const express = require('express');
const { loginValidator, signUpValidator } = require('../middleware/validation/auth');
const Auth = require('../controllers/AuthController');
const Mailer = require('../services/mailer-service');

const router = express.Router();

/**
 * POST /api/v1/auth/signup
 *
 * body: {
 *  email: "foo@bar.com",
 *  password: "MoreThan6Chars"
 * }
 *
 * @returns {any} The ID of the user and a token
 * @description Registers new user in database and sends them welcome email
 */
router.post('/signup', signUpValidator, (req, res, next) => {
  Auth
    .signup(req.body.email, req.body.password)
    .then((signUpResponse) => {
      res.json(signUpResponse);
      Mailer.sendWelcomeEmail(req.body.email);
    })
    .catch((err) => {
      res.status(err.status || 500).json(err);
    });
});

/**
 * POST /api/v1/auth/login
 *
 * body: {
 *  email: "foo@bar.com",
 *  password: "MoreThan6Chars"
 * }
 *
 * @returns {any} The ID of the user and a token
 * @description Returns a newly generated JWT for the user
 */
router.post('/login', loginValidator, (req, res, next) => {
  Auth
    .login(req.body.email, req.body.password)
    .then((loginResponse) => {
      res.json(loginResponse);
    })
    .catch((err) => {
      res.status(err.status || 500).json(err);
    });
});

/**
 * POST /api/v1/auth/forgot_password
 *
 * body: {
 *  email: "foo@bar.com"
 * }
 *
 * @returns {} Status code 200 after email is sent
 */
router.post('/forgot_password', (req, res, next) => {
  Auth
    .resetPassword(req.body.email)
    .then((payload) => {
      Mailer
        .sendResetPasswordEmail(req.body.email, payload.token, req.headers.host, (err, sgRes) => {
          if (!err) return res.status(200).send();
          return res.status(500).json(err);
        });
    })
    .catch((err) => {
      res.status(err.status || 500).json(err);
    });
});

module.exports = router;
