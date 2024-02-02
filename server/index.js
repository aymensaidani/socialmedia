const express = require('express');

const cors = require('cors');

const cookieParser = require('cookie-parser');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(cookieParser());

const PORT = 3001;
const db = require('./db.js');

const usersRoute = require('./routes/users.js');
const likesRoute = require('./routes/likes.js');
const postsRoute = require('./routes/posts.js');
const commentsRoute = require('./routes/comments.js');
const authentificationRoute = require('./routes/authentification.js');
const relationRoute = require('./routes/relation.js');
const storiesRoute = require('./routes/stories.js');

app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);
app.use('/api/likes', likesRoute);
app.use('/api/comments', commentsRoute);
app.use('/api/auth', authentificationRoute);
app.use('/api/relationships', relationRoute);
app.use('/api/stories', storiesRoute);

app.listen(PORT, function () {
  console.log(`Server run on port ${PORT}`);
});
