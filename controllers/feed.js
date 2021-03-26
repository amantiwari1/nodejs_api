import { validationResult } from "express-validator";
import Post from "../models/post";
import User from "../models/user";
import fs from "fs";
import path from "path";
// Get feed/posts
export const getPosts = (req, res, next) => {
  const CurrentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((CurrentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      return res.status(200).json({
        message: "fetched all post",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// POST feed/post
export const createPosts = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace("\\", "/");
  const title = req.body.title;
  const content = req.body.content;
  let creator;

  const newPost = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });

  newPost
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(newPost);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "success",
        post: newPost,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// GET feed/post
export const getPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      console.log(post);
      if (!post) {
        const error = new Error(" Could not find post");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "post fetched", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const updatePost = (req, res, next) => {
  const postId = req.params.postId;

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }

  if (!imageUrl) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("No authenticated");
        error.statusCode = 403;
        throw error;
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      return res.status(200).json({ message: "updated", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error(" Could not find post");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("No authenticated");
        error.statusCode = 403;
        throw error;
      }

      clearImage(post.imageUrl);

      return Post.findByIdAndDelete(postId);
    })
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then(() => {
      return res.status(200).json({ message: "deleted post" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  const filePth = path.join(__dirname, "..", filePath);
  fs.unlink(filePth, (err) => console.error(err));
};
