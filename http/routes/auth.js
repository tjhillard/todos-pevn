const express = require('express');
const { loginValidator, signUpValidator } = require('../middleware/validation/auth');
const Auth = require('../controllers/AuthController');
const Mailer = require('../services/mailer-service');

const router = express.Router();

// --- POST /api/v1/auth/signup ---
// body: {
//   email: 'foo@bar.com',
//   password: 'MoreThan6Char$'
// }
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

// POST /api/v1/auth/login
// body: {
//   email: 'foo@bar.com',
//   password: 'FooBar123!'
// }
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

router.post('/forgot_password', (req, res, next) => {
  Auth
    .resetPassword(req.body.email)
    .then((payload) => {
      res.status(200).send();
      Mailer.sendResetPasswordEmail(req.body.email, payload.token, req.headers.host);
    })
    .catch((err) => {
      res.status(err.status || 500).json(err);
    });
});

module.exports = router;
