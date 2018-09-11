const Joi = require('joi');
const User = require('../../controllers/UserController');
const Response = require('../../services/response-service');

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {any} next
 * @description Observes request body and validates it against Joi schema
 */
exports.signUpValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  // valid request body?
  const validatedRequest = Joi.validate(req.body, schema);
  if (validatedRequest.error) {
    return res
      .status(400)
      .json(Response.badRequest400(validatedRequest.error.details, `${validatedRequest.error.details[0].message}.`));
  }
  // unique email?
  User.getOneByEmail(req.body.email)
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json(Response.badRequest400({
          invalid_field: 'email',
          reason: 'unique',
        }, 'This email has already been registered.'));
      }
      // good to go
      next();
    });
};

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {any} next
 * @description Observes request body and validates it against Joi schema
 */
exports.loginValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  // valid request body?
  const validatedRequest = Joi.validate(req.body, schema);
  if (validatedRequest.error) {
    return res
      .status(400)
      .json(Response.badRequest400(validatedRequest.error.details, `${validatedRequest.error.details[0].message}.`));
  }
  // good to go
  next();
};

