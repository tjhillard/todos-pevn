const Joi = require('joi');
const User = require('../../controllers/UserController');
const Response = require('../../services/response-service');

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.signUpValidator = (req, res, next) => {
  // valid request body?
  const validatedRequest = Joi.validate(req.body, schema);
  if (validatedRequest.error) {
    return res.status(400).json(Response.badRequest400(validatedRequest.error));
  }
  // unique email?
  User.getOneByEmail(req.body.email)
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json(Response.badRequest400({
          invalid_field: 'email',
          reason: 'unique',
        }));
      }
      // good to go
      next();
    });
};

exports.loginValidator = (req, res, next) => {
  // valid request body?
  const validatedRequest = Joi.validate(req.body, schema);
  if (validatedRequest.error) {
    return res.status(400).json(Response.badRequest400(validatedRequest.error));
  }
  // good to go
  next();
};

