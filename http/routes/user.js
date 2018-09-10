const express = require('express');
const User = require('../controllers/UserController');
const { updatePasswordValidator } = require('../middleware/validation/user');

const router = express.Router();

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
