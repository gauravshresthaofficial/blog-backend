const bcrypt = require("bcrypt");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Understanding React Hooks",
    author: "Jane Doe",
    url: "https://reacthooksguide.com/",
    likes: 12,
  },
  {
    title: "Mastering Async/Await in JavaScript",
    author: "John Smith",
    url: "https://asyncawaitmastery.com/",
    likes: 8,
  },
];

const oneBlog = {
  title: "Deep Dive into Node.js Event Loop",
  author: "Alice Johnson",
  url: "https://nodejseventloop.com/",
  likes: 15,
};

const newBlog = {
  title: "Introduction to GraphQL",
  author: "Bob Brown",
  url: "https://graphqlintro.com/",
  likes: 20,
};

const blogWithoutUrl = {
  title: "The Importance of Clean Code",
  author: "Charlie Davis",
  likes: 7,
};

const blogWithoutTitle = {
  author: "Eve White",
  url: "https://cleancodebenefits.com/",
  likes: 9,
};

const blogWithoutLikes = {
  title: "Functional Programming Basics",
  author: "Frank Green",
  url: "https://functionalprogramming101.com/",
};

const loginUser = {
  username: "testUser",
  password: "testPassword123",
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const addLoginUser = async () => {
  const passwordHash = await bcrypt.hash(loginUser.password, 10);
  const user = new User({ username: loginUser.username, passwordHash });
  await user.save();
};

const initialUsers = [
  { username: "admin", password: "adminPassword" },
  { username: "testUser1", password: "testPassword1" },
];

const newUser = {
  username: "mluukkai",
  name: "Matti Luukkainen",
  password: "salainen",
};

const dupUser = {
  username: "admin",
  name: "Superuser",
  password: "salainen",
};

const shortUsernameUser = {
  username: "ro",
  name: "Superuser",
  password: "salainen",
};

const shortPassUser = {
  username: "validUser",
  name: "Valid User",
  password: "pa",
};

module.exports = {
  initialBlogs,
  oneBlog,
  blogWithoutUrl,
  blogWithoutTitle,
  blogWithoutLikes,
  usersInDb,
  addLoginUser,
  loginUser,
  newBlog,
  initialUsers,
  newUser,
  dupUser,
  shortUsernameUser,
  shortPassUser,
};
