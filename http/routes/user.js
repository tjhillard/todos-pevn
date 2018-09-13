const express = require('express');
const User = require('../controllers/UserController');
const { updatePasswordValidator } = require('../middleware/validation/user');

const router = express.Router();

/**
 * GET /api/v1/users/me
 *
 * @returns The authenticated user resource + jwt metadata
 */
router.get('/me', (req, res, next) => {
  if (req.user) return res.json(req.user);
  next();
});

/**
 * PUT /api/v1/users/update_password
 *
 * @returns {User} Newly updated User resource
 */
router.put('/update_password', updatePasswordValidator, (req, res, next) => {
  User
    .updatePassword(req.user.id, req.body.password)
    .then((updatePassResponse) => {
      res.json(updatePassResponse);
    })
    .catch((err) => {
      res.status(err.status || 500).json(err);
    });
});

module.exports = router;
