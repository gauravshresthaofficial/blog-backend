# Bloglist Backend

A backend application for managing blogs, focusing on user administration and token-based authentication.

## Table of Contents

- [Introduction](#introduction)
- [Setup](#setup)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Introduction

This project implements user management and token-based authentication for a bloglist application. It uses Node.js with Express as the server framework and MongoDB as the database.

## Setup

### Prerequisites

Ensure you have:

1. **Node.js** installed.
2. A MongoDB instance running (either locally or via MongoDB Atlas).

### Installation Steps

1. Clone this repository:

   ```bash
   git clone https://github.com/gauravshresthaofficial/blog-backend.git
   ```

2. Navigate into your cloned repository:

   ```bash
   cd blog-backend/
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory with necessary variables (`MONGODB_URI`, `SECRET`, `PORT`).

5. Start the server:

   ```bash
   npm run dev
   ```

6. Access API endpoints at:

   ```
   http://localhost:<PORT>/
   ```

   _(Replace `<PORT>` with the value specified in your `.env` file.)_

## Features

- **User Registration**: Users can create accounts.
- **Login**: Users receive authentication tokens.
- **Blog Creation**: Authenticated users can create blogs.
- **Blog Deletion**: Users can delete their blogs.

## API Endpoints

| Endpoint       | Method | Description                |
| -------------- | ------ | -------------------------- |
| /api/users     | POST   | Register new user          |
| /api/login     | POST   | Login to receive JWT token |
| /api/blogs     | GET    | List all blogs             |
| /api/blogs/:id | DELETE | Delete specific blog       |

### Request Body Examples:

#### User Registration (`POST /api/users`)

```json
{
  "username": "exampleuser",
  "password": "strongpassword",
  "name": "John Doe"
}
```

#### Login (`POST /api/login`)

```json
{
  "username": "exampleuser",
  "password": "strongpassword"
}
```

#### Creating New Blog (`POST /api/blogs`)

```json
{
  "title": "Introduction to GraphQL",
  "author": "Bob Brown",
  "url": "https://graphqlintro.com/",
  "likes": 20,
};
```

Headers must include `Authorization: Bearer YOUR_TOKEN_HERE`.

## Testing

To run the tests for the blog API, use the following command:

```bash
npm test -- tests/blog_api.test.js
```

To run the tests for the user API, use the following command:

```bash
npm test -- tests/user_api.test.js
```
