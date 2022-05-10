const { Post } = require('./post.model');
const { User } = require('./user.model');
const { Comment } = require('./comment.model');

const initModels = () => {
  // Models relationship
  User.hasMany(Post);
  Post.belongsTo(User);

  User.hasMany(Comment);
  Comment.belongsTo(User);

  Post.hasMany(Comment);
  Comment.belongsTo(Post);
};

module.exports = { initModels };
