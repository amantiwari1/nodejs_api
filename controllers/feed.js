import { validationResult } from "express-validator";
import Post from "../models/post";

// Get feed/posts
export const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "first post",
        content: "first content",
        imageUrl: "images/duck.jpg",
        creator: {
          name: "aman tiwari",
        },
        createdAt: new Date(),
      },
    ],
  });
};

// POST feed/post
export const createPosts = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;

  const newPost = new Post({
    title: title,
    content: content,
    imageUrl: 'images/duck.jpg',
    creator: {
      name: "Aman Tiwari",
    },
  });

  newPost
    .save()
    .then((result) => {
      res.status(201).json({
        message: "success",
        post: result,
      });
    })
    .catch((err) => console.log(err));
};
