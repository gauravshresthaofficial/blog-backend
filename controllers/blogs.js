const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const { title, url, userId } = request.body;

  // decodes the token, or returns the Object which the token was based on
  const decodedToken = request.user;

  const user = await User.findById(decodedToken.id);

  if (!title || !url) {
    return response.status(400).json({ error: "Title or URL missing!" });
  }

  const blog = new Blog({ ...request.body, user: user.id });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const id = request.params.id;

  const user = request.user;

  // Check if the user exists
  if (!user) {
    return response
      .status(401)
      .json({ error: "Token invalid or user not found" });
  }

  // Find the blog by ID
  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).json({ error: "Blog not found" });
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response
      .status(403)
      .json({ error: "Forbidden: You are not the owner of this blog" });
  }
  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { title, author, url, likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { title, author, url, likes },
    { new: true }
  );
  response.json(updatedBlog);
});

module.exports = blogsRouter;
