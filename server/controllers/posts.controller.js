// Models
const { Post } = require('../models/post.model');
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');

const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    include: [{ model: User, attributes: { exclude: ['password'] } }],
  });

  res.status(200).json({
    posts,
  });
});

const createPost = catchAsync(async (req, res, next) => {
  const { title, content, userId } = req.body;

  const newPost = await Post.create({ title, content, userId });

  res.status(201).json({ newPost });
});

const getPostById = catchAsync(async (req, res, next) => {
  const { post } = req;

  res.status(200).json({
    post,
  });
});

const updatePost = catchAsync(async (req, res, next) => {
  const { post } = req;
  const { title, content } = req.body;

  await post.update({ title, content });

  res.status(200).json({
    status: 'success',
  });
});

const deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
};
