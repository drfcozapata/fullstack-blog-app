const express = require('express');

// Middlewares
const { postExists } = require('../middlewares/posts.middlewares');
const { protectToken } = require('../middlewares/users.middlewares');
const {
  createPostValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

// Controller
const {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getUsersPost,
  getMyPosts,
} = require('../controllers/posts.controller');

const { upload } = require('../utils/multer');

const router = express.Router();

router.use(protectToken);

router
  .route('/')
  .get(getAllPosts)
  .post(
    upload.array('postImgs', 3),
    createPostValidations,
    checkValidations,
    createPost
  );

router.get('/me', getMyPosts);
router.get('/profile/:id', getUsersPost);

router
  .use('/:id', postExists)
  .route('/:id')
  .get(getPostById)
  .patch(updatePost)
  .delete(deletePost);

module.exports = { postsRouter: router };
