const Joi = require('joi');
const Response = require('../../services/response-service');

exports.updatePasswordValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    password: Joi.string().min(6).required(),
  });
  // valid request body?
  const validatedRequest = Joi.validate(req.body, schema);
  if (validatedRequest.error) {
    return res
      .status(400)
      .json(Response.badRequest400(validatedRequest.error.details, `${validatedRequest.error.details[0].message}.`));
  }
  next();
};

