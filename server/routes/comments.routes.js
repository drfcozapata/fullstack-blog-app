const express = require('express');

// Middlewares
const { protectToken } = require('../middlewares/users.middlewares');
const {
  createCommentValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');
const { commentExists } = require('../middlewares/comments.middlewares');

// Controllers
const {
  getAllComments,
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
} = require('../controllers/comments.controller');

const router = express.Router();

// Apply ProtectToken middleware
router.use(protectToken);

// GET / Get all comments
router.get('/', getAllComments);

// POST /:postId Create a comment
router.post(
  '/:postId',
  createCommentValidations,
  checkValidations,
  createComment
);

// GET /:id Get comments by id
// PATCH /:id Update a comment
// DELETE /:id Delete a comment
router
  .use('/:id', commentExists)
  .route('/:id')
  .get(getCommentById)
  .patch(updateComment)
  .delete(deleteComment);

module.exports = { commentsRouter: router };
