const express = require('express');
const ResourceController = require('../controllers/ResourceController.js');
const { newTodoValidator, updateTodoValidator } = require('../middleware/validation/todo');
const RespondWith = require('../services/response-service.js');

const Todo = new ResourceController('todo');
const router = express.Router();


/**
 * GET /api/v1/todos
 *
 * @returns {Todo[]} Array of todo resource objects
 */
router.get('/', (req, res, next) => {
  const options = {
    per_page: req.query.per_page,
    page_number: req.query.page_number,
    order_by: req.query.order_by,
    order: req.query.order,
  };

  Todo
    .paginate(req.user.id, options)
    .then((todos) => {
      res.json(RespondWith.collection(todos, req.query));
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * GET /api/v1/todos/:id
 *
 * @returns {Todo} Matched Todo resource object
 */
router.get('/:id', (req, res, next) => {
  Todo
    .getById(req.user.id, req.params.id)
    .then((todo) => {
      if (todo) {
        return res.json(RespondWith.resource(todo));
      }
      return res.status(404).json(RespondWith.notFound404(req));
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * POST /api/v1/todos
 *
 * body: {
 *  description: "Feed my cat"
 * }
 *
 * @returns {Todo} Newly created Todo resource object
 */
router.post('/', newTodoValidator, (req, res, next) => {
  Todo
    .create({
      user_id: req.user.id,
      description: req.body.description,
    })
    .then((todo) => {
      res.json(RespondWith.resource(todo));
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * PUT /api/v1/todos/:id
 *
 * body: {
 *  description?: "Feed my cat",
 *  completed?: true
 * }
 *
 * @returns {Todo} Newly updated Todo resource object
 */
router.put('/:id', updateTodoValidator, (req, res, next) => {
  const newTodoData = {};
  if (req.body.description) {
    newTodoData.description = req.body.description;
  }
  if (req.body.completed !== undefined) {
    newTodoData.completed = req.body.completed;
  }
  Todo
    .update(req.user.id, req.params.id, newTodoData)
    .then((todo) => {
      if (todo.length === 1) {
        return res.json(RespondWith.resource(todo));
      }
      return res.status(404).json(RespondWith.notFound404(req));
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * DELETE /api/v1/todos/:id
 *
 * @returns {Todo} Empty body with 204 response
 */
router.delete('/:id', (req, res, next) => {
  Todo
    .softDelete(req.user.id, req.params.id)
    .then((todo) => {
      if (todo.length === 1) {
        return res.status(204).send();
      }
      return res.status(404).json(RespondWith.notFound404(req));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
