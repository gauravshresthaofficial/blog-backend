const bcrypt = require("bcrypt");
const User = require("../models/user");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const assert = require("assert");
const { test, after, beforeEach, describe } = require("node:test");
const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    await api
      .post("/api/users")
      .send(helper.newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(helper.newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const result = await api
      .post("/api/users")
      .send(helper.dupUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("username must be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

test("creation fails with username less than 3 char", async () => {
  const result = await api
    .post("/api/users")
    .send(helper.shortUsernameUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert(
    result.body.error.includes("username length must be 3 charcters long")
  );
});
test("creation fails with passsword less than 3 char", async () => {
  const result = await api
    .post("/api/users")
    .send(helper.shortPassUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert(
    result.body.error.includes("password length must be 3 charcters long")
  );
});
after(async () => {
  await mongoose.connection.close();
});
