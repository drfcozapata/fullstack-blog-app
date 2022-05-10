const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appErrors');

const createUserValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const createPostValidations = [
  body('title').notEmpty().withMessage('Title cannot be empty'),
  body('content').notEmpty().withMessage('Content cannot be empty'),
];

const createCommentValidations = [
  body('text').notEmpty().withMessage('Comment cannot be empty'),
];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    // [msg, msg, msg] -> 'msg. msg. msg'
    const errorMsg = messages.join('. ');

    return next(new AppError(errorMsg, 400));
  }

  next();
};

module.exports = {
  createUserValidations,
  createPostValidations,
  createCommentValidations,
  checkValidations,
};
