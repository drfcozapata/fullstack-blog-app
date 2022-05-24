const { ref, uploadBytes } = require('firebase/storage');

// Models
const { Comment } = require('../models/comment.model');
const { Post } = require('../models/post.model');
const { PostImg } = require('../models/postImg.model');
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { storage } = require('../utils/firebase');

const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    where: { status: 'active' },
    include: [
      {
        model: PostImg,
        attributes: ['id', 'postImgUrl'],
      },
      {
        model: User,
        attributes: { exclude: ['password'] },
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  });

  res.status(200).json({
    posts,
  });
});

const createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { sessionUser } = req;

  const newPost = await Post.create({ title, content, userId: sessionUser.id });

  // Map through the files array and upload each file to firebase
  const postImgsPromises = req.files.map(async file => {
    // Create img ref
    const imgRef = ref(
      storage,
      `posts/${newPost.id}-${Date.now()}-${file.originalname}`
    );
    // Use uploadBytes to upload the file to firebase
    const imgUploaded = await uploadBytes(imgRef, file.buffer);
    // Create a new PostImg instance (PostImg.create)
    const newPostImg = await PostImg.create({
      postId: newPost.id,
      postImgUrl: imgUploaded.metadata.fullPath,
    });
    return newPostImg;
  });

  // Wait for all promises to resolve ([Promise {<pending>}]) and return the array
  const postImgsResolved = await Promise.all(postImgsPromises);

  res.status(200).json({
    status: 'success',
    post: newPost,
    postImgs: postImgsResolved,
  });
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

const getUsersPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const posts = await Post.findAll({
    where: { userId: id, status: 'active' },
    include: [{ model: User, attributes: { exclude: ['password'] } }],
  });

  res.status(200).json({
    posts,
  });
});

const getMyPosts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const posts = await Post.findAll({
    where: { userId: sessionUser.id, status: 'active' },
    include: [{ model: User, attributes: { exclude: ['password'] } }],
  });

  res.status(200).json({
    posts,
  });
});

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getUsersPost,
  getMyPosts,
};
