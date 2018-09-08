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

exports.updateTodoValidator = (req, res, next) => {
  if (!req.body.description && typeof req.body.completed === 'undefined') {
    return res.status(400).json(Response.badRequest400({}));
  }

  const schema = Joi.object().keys({
    description: Joi.string(),
    completed: Joi.boolean(),
  });

  // valid request body?
  const validatedRequest = Joi.validate(req.body, schema);
  if (validatedRequest.error) {
    return res.status(400).json(Response.badRequest400(validatedRequest.error));
  }
  next();
};
