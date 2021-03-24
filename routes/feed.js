import express, { Router } from "express";
import * as feedControllers from "../controllers/feed";
import { check } from "express-validator";


const updateArticleValidations = [
    check("title", "Please Enter title").not().isEmpty(),
    check("content", "Please Enter content").not().isEmpty(),
    check("title", "max 150 characters").isLength({ max: 150 }),
    check("title", "max 150 characters").isLength({ min: 5 }),
    check("content", "too short content").isLength({ min: 7 }),
    check("content", "too long content").isLength({ max: 500 }),
];


const feed = Router();

feed.route('/posts').get(feedControllers.getPosts)
feed.route('/post').post(updateArticleValidations, feedControllers.createPosts)

export default feed;