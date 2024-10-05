import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY: string = process.env.signKey || "someSpecialSuperUser";

interface CustomError extends Error {
  code?: number;
  data?: any;
}

//-------------------------------- Signup  --------------------------------
exports.signup = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    console.log(errors);

    if (!errors.isEmpty()) {
      const error: CustomError = new Error(errors.array()[0].msg);
      error.code = 422;
      error.data = errors.array();
      throw error;
    }

    const { username, password, role } = req.body;

    const isUser = await User.findOne({ username: username });
    if (isUser) {
      throw new Error("Giver UserName already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      password: hashedPassword,
      role: role,
    });

    const result = await user.save();

    const token = jwt.sign(
      {
        userId: result._id.toString(),
        role: result.role,
      },
      SECRET_KEY,
      { expiresIn: "25h" }
    );

    res.status(201).json({
      message: "Welcome to VCL Communication,  " + username,
      token,
      name: result.username,
      role: result.role,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//-------------------------------- Login  --------------------------------
exports.login = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    console.log(errors);

    if (!errors.isEmpty()) {
      const error: CustomError = new Error(errors.array()[0].msg);
      error.code = 422;
      error.data = errors.array();
      throw error;
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      const err: CustomError = new Error(`User ${username} not found`);
      err.code = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err: CustomError = new Error("Wrong password");
      err.code = 401;
      throw err;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "25h" }
    );

    res.status(201).json({
      message: `Welcome back, ${username}! You're now logged into your VCL Communication account.`,
      token,
      name: user.username,
      role: user.role,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
