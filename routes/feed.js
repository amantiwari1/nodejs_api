import express, { Router } from "express";
import * as feedControllers from "../controllers/feed";
import { check } from "express-validator";
import isAuth from '../middleware/is-auth'


const updateArticleValidations = [
    check("title", "Please Enter title").not().isEmpty(),
    check("content", "Please Enter content").not().isEmpty(),
    check("title", "max 150 characters").isLength({ max: 150 }),
    check("title", "max 150 characters").isLength({ min: 7 }),
    check("content", "too short content").isLength({ min: 5 }),
    check("content", "too long content").isLength({ max: 500 }),
];


const feed = Router();

feed.route('/posts').get(isAuth, feedControllers.getPosts)
feed.route('/post').post(isAuth, updateArticleValidations, feedControllers.createPosts)
feed.route('/post/:postId').get(isAuth, feedControllers.getPost)
feed.route('/post/:postId').put(isAuth, updateArticleValidations, feedControllers.updatePost)
feed.route('/post/:postId').delete(isAuth, feedControllers.deletePost)

export default feed;