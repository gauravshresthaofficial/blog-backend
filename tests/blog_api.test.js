const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
  await User.deleteMany({});
  await User.insertMany([]);
  await helper.addLoginUser();
});

describe("blog list application", () => {
  describe("when fetching blog posts", () => {
    test("should return blogs in JSON format with status code 200", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("should return the correct number of blog posts", async () => {
      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test("should ensure the unique identifier property of blog posts is named 'id'", async () => {
      const response = await api.get("/api/blogs");
      response.body.forEach((blog) => {
        assert.ok(blog.id, "Expected blog to have an 'id' property");
        assert.strictEqual(response.body.__v, undefined);
      });
    });
  });

  describe("when creating a new blog post", () => {
    test("should return 401 Unauthorized if token is not provided", async () => {
      const response = await api
        .post("/api/blogs")
        .send(helper.newBlog)
        .expect(401);
      assert.strictEqual(response.body.error, "Token missing");
    });

    test("should save the blog post to the database", async () => {
      const initialBlogs = await api.get("/api/blogs");
      const loggedUser = await api.post("/api/login").send(helper.loginUser);
      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${loggedUser.body.token}`)
        .send(helper.newBlog);
      const totalBlogs = await api.get("/api/blogs");

      assert.strictEqual(response.body.title, helper.newBlog.title);
      assert.strictEqual(response.body.author, helper.newBlog.author);
      assert.strictEqual(response.body.url, helper.newBlog.url);
      assert.strictEqual(response.body.likes, helper.newBlog.likes);
      assert.strictEqual(totalBlogs.body.length, initialBlogs.body.length + 1);
    });

    test("should default likes to 0 if the likes property is missing", async () => {
      const loggedUser = await api.post("/api/login").send(helper.loginUser);
      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${loggedUser.body.token}`)
        .send(helper.blogWithoutLikes);

      assert.strictEqual(response.body.likes, 0);

      const totalBlogs = await api.get("/api/blogs");
      assert.strictEqual(totalBlogs.body.length, helper.initialBlogs.length + 1);
    });

    test("should return 400 Bad Request if the title is missing", async () => {
      const loggedUser = await api.post("/api/login").send(helper.loginUser);
      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${loggedUser.body.token}`)
        .send(helper.blogWithoutTitle)
        .expect(400);
    });

    test("should return 400 Bad Request if the URL is missing", async () => {
      const loggedUser = await api.post("/api/login").send(helper.loginUser);
      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${loggedUser.body.token}`)
        .send(helper.blogWithoutUrl)
        .expect(400);
    });
  });

  describe("when deleting a blog post", () => {
    test("should succeed with status code 204 if the ID is valid", async () => {
      const initialBlogs = await api.get("/api/blogs");
      const loggedUser = await api.post("/api/login").send(helper.loginUser);
      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${loggedUser.body.token}`)
        .send(helper.newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      await api
        .delete(`/api/blogs/${response.body.id}`)
        .set("Authorization", `Bearer ${loggedUser.body.token}`)
        .expect(204);
      const totalBlogs = await api.get("/api/blogs");

      assert.strictEqual(totalBlogs.body.length, initialBlogs.body.length);
    });
  });

  describe("when updating a blog post", () => {
    test("should succeed with status code 200 if the ID is valid", async () => {
      const loggedUser = await api.post("/api/login").send(helper.loginUser);
      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${loggedUser.body.token}`)
        .send(helper.newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogToUpdate = response.body;
      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };
      await api
        .put(`/api/blogs/${response.body.id}`)
        .send(updatedBlog)
        .expect(200);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});