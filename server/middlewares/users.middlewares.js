// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ where: { id } });

  if (!user) {
    return next(new AppError('No user found with the given id', 404));
  }

  // Add user data to the req object
  req.user = user;

  next();
});

module.exports = { userExists };
