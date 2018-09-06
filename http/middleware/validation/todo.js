const Joi = require('joi');
const Response = require('../../services/response-service');

exports.newTodoValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    description: Joi.string().required(),
    completed: Joi.boolean(),
  });

  // valid request body?
  const validatedRequest = Joi.validate(req.body, schema);
  if (validatedRequest.error) {
    return res.status(400).json(Response.badRequest400(validatedRequest.error));
  }
  next();
};

exports.completedTodoValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    completed: Joi.boolean().required(),
  });

  // valid request body?
  const validatedRequest = Joi.validate(req.body, schema);
  if (validatedRequest.error) {
    return res.status(400).json(Response.badRequest400(validatedRequest.error));
  }
  next();
};
