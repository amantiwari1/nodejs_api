import User from "../models/user";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation falied.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const newUser = User({
        name: name,
        email: email,
        password: hashPassword,
      });

      return newUser.save();
    })
    .then((result) => {
      return res
        .status(201)
        .json({ message: "added new user", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("please sign up with mail");
        error.statusCode = 401;
        error.data = errors.array();
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong Password");
        error.statusCode = 401;
        error.data = errors.array();
        throw error;
      }
      const token = jwt.sign({
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      }, 'sercet', {expiresIn: '1h'});

      return res.status(200).json({token: token, userId: loadedUser._id.toString()});
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
