const { app } = require('./app');

// Models
const { Post } = require('./models/post.model');
const { User } = require('./models/user.model');

// Utils
const { db } = require('./utils/database');

// Authenticate database credentials
db.authenticate()
  .then(() => console.log('Database connected and authenticated successfully'))
  .catch(err => console.log('Error ocurr during database authentication', err));

// Models relationship
User.hasMany(Post);
Post.belongsTo(User);

// Sync sequelize models
db.sync()
  .then(() => console.log('Database synced successfully'))
  .catch(err => console.log('Error ocurr during database syncing', err));

// Spin up server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express app running on http://localhost:${PORT}`);
});
