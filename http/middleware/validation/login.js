const Joi = require('joi');
const Response = require('../../services/response-service');

const schema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = (req, res, next) => {
  // valid request body?
  const validatedRequest = Joi.validate(req.body, schema);
  if (validatedRequest.error) {
    return res.status(400).json(Response.badRequest400(validatedRequest.error));
  }
  next();
};
