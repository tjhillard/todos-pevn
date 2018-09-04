const express = require('express');
const db = require('../db/todo.js');

const RequestValidator = require('../src/request-schema-validator');
const ResponseService = require('../src/response-service');

const router = express.Router();

// GET /api/v1/todos
router.get('/', (req, res, next) => {
  db.paginate(req.user.id, { per_page: req.query.per_page, pageNumber: req.query.page_number })
    .then((todos) => {
      res.json(ResponseService.collection(todos, req.query));
    })
    .catch((err) => {
      next(err);
    });
});

// GET /api/v1/todos/:id
router.get('/:id', (req, res, next) => {
  db.getById(req.user.id, req.params.id)
    .then((todo) => {
      if (todo) {
        return res.json(ResponseService.resource(todo));
      }
      return res.status(404).json(ResponseService.notFound404(req));
    })
    .catch((err) => {
      next(err);
    });
});

// POST /api/v1/todos
router.post('/', (req, res) => {
  RequestValidator
    .validateRequestBody('todo', req.body)
    .then((missingRequiredProperties) => {
      if (missingRequiredProperties.length > 0) {
        return res.status(400).json(ResponseService.badRequest400({
          missing_fields: missingRequiredProperties,
        }));
      }

      db.create({
        user_id: req.user.id,
        description: req.body.description,
      }).then((todo) => {
        res.json(ResponseService.resource(todo));
      });
    });
});

// PUT /api/v1/todos/:id
router.put('/:id', (req, res) => {
  const newTodoData = {};
  if (req.body.description) {
    newTodoData.description = req.body.description;
  }
  if (typeof req.body.completed !== 'undefined') {
    newTodoData.completed = req.body.completed;
  }
  db.update(req.user.id, req.params.id, newTodoData).then((todo) => {
    if (todo.length === 1) {
      return res.json(ResponseService.resource(todo));
    }
    return res.status(404).json(ResponseService.notFound404(req));
  });
});

// DELETE /api/v1/todos/:id
router.delete('/:id', (req, res) => {
  db.delete(req.user.id, req.params.id).then((deletedTodo) => {
    if (deletedTodo.length > 0) {
      return res.status(204).send();
    }
    return res.status(404).send();
  });
});

module.exports = router;
