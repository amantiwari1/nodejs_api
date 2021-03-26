import express, { Router } from "express";
import * as authControllers from "../controllers/auth";
import { check } from "express-validator";
import User from "../models/user";

const NewUserValidations = [
  check("email", "Invaild email").isEmail(),
  check("email", "Email is already exist").custom((value, { req }) => {
    return User.findOne({ email: value }).then((userDoc) => {
      if (userDoc) {
        return Promise.reject("Email address already exists");
      }
    });
  }),
  check("password", "password is too short").isLength({ min: 5 }),
  check("name", "Enter the name").not().isEmpty(),
];

const auth = Router();

auth.route("/signup").put(NewUserValidations, authControllers.signup);
auth.route("/login").post(authControllers.login);

export default auth;
