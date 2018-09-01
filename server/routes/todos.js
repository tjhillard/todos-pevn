const express = require('express');
const db = require('../db/db-service-base');

const ValidationService = require('../api/request-validator');
const ResponseService = require('../api/response-service');

const router = express.Router();

// GET /todos
router.get('/', (req, res, next) => {
  db.getAll('todo')
    .then((todos) => {
      res.json(ResponseService.collection(todos));
    })
    .catch((err) => {
      next(err);
    });
});

// GET /todos/:id
router.get('/:id', (req, res, next) => {
  let todoFromDb;
  try {
    todoFromDb = db.getById('todo', req.params.id).first();
  } catch (err) {
    next(err);
  }
  todoFromDb
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

// POST /todos
router.post('/', (req, res) => {
  new ValidationService('todo', req.body)
    .validateRequestBody()
    .then((missingRequiredProperties) => {
      if (missingRequiredProperties.length > 0) {
        return res.status(400).json(ResponseService.badRequest400(req, {
          missing_fields: missingRequiredProperties,
        }));
      }
    })
    .then(() => {
      db.create('todo', {
        description: req.body.description,
      }).then((todo) => {
        res.json(ResponseService.resource(todo));
      });
    });
});

// PUT /todos/:id
router.put('/:id', (req, res) => {
  const newTodoData = {};
  if (req.body.description) {
    newTodoData.description = req.body.description;
  }
  if (typeof req.body.completed !== 'undefined') {
    newTodoData.completed = req.body.completed;
  }
  db.update('todo', req.params.id, newTodoData).then((todo) => {
    res.json(ResponseService.resource(todo));
  });
});

// DELETE /todos/:id
router.delete('/:id', (req, res) => {
  db.delete('todo', req.params.id).then((deletedTodo) => {
    if (deletedTodo.length > 0) {
      return res.status(204).send();
    }
    return res.status(404).send();
  });
});

module.exports = router;
