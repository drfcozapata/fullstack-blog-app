// Models
const { Comment } = require('../models/comment.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');

const commentExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findOne({
    where: { id, status: 'active' },
  });

  if (!comment) {
    return next(new AppError('No comment found with the given id', 404));
  }

  req.comment = comment;

  next();
});

module.exports = { commentExists };
