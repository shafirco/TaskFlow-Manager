const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const {
  validateCreateTask,
  validateUpdateTask,
  validateDeleteTask
} = require('../middleware/validation');

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Public
router.get('/', getTasks);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Public
router.post('/', validateCreateTask, createTask);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Public
router.put('/:id', validateUpdateTask, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Public
router.delete('/:id', validateDeleteTask, deleteTask);

module.exports = router;
