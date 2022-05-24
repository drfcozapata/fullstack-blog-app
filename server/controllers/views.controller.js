const path = require('path');

const { Post } = require('../models/post.model');

const { catchAsync } = require('../utils/catchAsync');

const renderIndex = catchAsync(async (req, res) => {
  const posts = await Post.findAll({ where: { status: 'active' } });

  res.status(200).render('index', { title: 'Home', posts });
});

module.exports = { renderIndex };
