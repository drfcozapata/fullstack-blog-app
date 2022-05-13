const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Models
const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
const { Comment } = require('../models/comment.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');
const { storage } = require('../utils/firebase');

dotenv.config((path = './config.env'));

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    include: [
      { model: Post, attributes: ['id', 'title', 'content'] },
      { model: Comment, attributes: ['id', 'text', 'postId'] },
    ],
  });

  res.status(200).json({
    users,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role, profileImgUrl } = req.body;

  console.log(req.file);
  const imgRef = ref(storage, `users/${req.file.originalname}`);
  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  // Encrypt password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    profileImgUrl: imgUploaded.metadata.fullPath,
  });
  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    newUser,
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  const imgRef = ref(storage, user.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  user.profileImgUrl = url;

  res.status(200).json({
    user,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email, password, status } = req.body;

  await user.update({ name, email, password, status });

  res.status(200).json({
    status: 'success',
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  //Compare password with hashed password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Create JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  user.password = undefined;
  res.status(200).json({ token, user });
});

const checkToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.sessionUser });
});

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  checkToken,
};
