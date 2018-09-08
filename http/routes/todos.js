const express = require('express');
const ResourceController = require('../controllers/ResourceController.js');
const { newTodoValidator, updateTodoValidator } = require('../middleware/validation/todo');
const RespondWith = require('../services/response-service.js');

const Todo = new ResourceController('todo');
const router = express.Router();

// GET /api/v1/todos
router.get('/', (req, res, next) => {
  Todo
    .paginate(req.user.id, { per_page: req.query.per_page, page_number: req.query.page_number })
    .then((todos) => {
      res.json(RespondWith.collection(todos, req.query));
    })
    .catch((err) => {
      next(err);
    });
});

// GET /api/v1/todos/:id
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

// POST /api/v1/todos
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

// PUT /api/v1/todos/:id
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

// DELETE /api/v1/todos/:id
router.delete('/:id', (req, res, next) => {
  Todo
    .softDelete(req.user.id, req.params.id)
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

module.exports = router;
