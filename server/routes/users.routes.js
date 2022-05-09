const express = require('express');

// Middlewares
const {
  userExists,
  protectToken,
  protectAdmin,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');
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
  login,
  checkToken,
} = require('../controllers/users.controller');

const router = express.Router();

router.post('/', createUserValidations, checkValidations, createUser);
router.post('/login', login);

// Apply ProtectToken middleware
router.use(protectToken);

router.get('/check-token', checkToken);

router.get('/', protectAdmin, getAllUsers);
router.get('/:id', protectAdmin, userExists, getUserById);

router
  .use('/:id', userExists, protectAccountOwner)
  .route('/:id')
  .patch(updateUser)
  .delete(deleteUser);

module.exports = { usersRouter: router };
