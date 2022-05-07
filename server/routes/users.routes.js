const express = require('express');

// Middlewares
const { userExists } = require('../middlewares/users.middlewares');
const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

// Controller
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/users.controller');

const router = express.Router();

router
  .route('/')
  .get(getAllUsers)
  .post(createUserValidations, checkValidations, createUser);
router
  .use('/:id', userExists)
  .route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = { usersRouter: router };
