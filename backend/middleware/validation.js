const { body, param } = require('express-validator');

// Validation rules for creating a task
const validateCreateTask = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim()
];

// Validation rules for updating a task
const validateUpdateTask = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim(),
  body('status')
    .optional()
    .isIn(['Pending', 'Completed'])
    .withMessage('Status must be either Pending or Completed')
];

// Validation rules for deleting a task
const validateDeleteTask = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID')
];

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateDeleteTask
};
