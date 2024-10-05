import express, { Request, Response, NextFunction } from "express";
import { check, body } from "express-validator";
import dotenv from "dotenv";
import Resume from "../models/resume";
const studentController = require("../controllers/student");
const isAuth = require("../middlewares/is-auth");
const authorizeRoles = require("../middlewares/authorize");

dotenv.config();

const router = express.Router();

router.post(
  "/addDetails",
  // [
  //   check("name")
  //     .notEmpty()
  //     .withMessage("Name is required.")
  //     .isLength({ min: 3 })
  //     .withMessage("Name must be at least 3 characters long."),
  //   check("email")
  //     .notEmpty()
  //     .withMessage("Email is required.")
  //     .isEmail()
  //     .withMessage("Must be a valid email address."),
  //   check("contactNumber")
  //     .notEmpty()
  //     .withMessage("Contact number is required.")
  //     .isMobilePhone("en-IN")
  //     .withMessage("Must be a valid contact number."),
  //   check("resume")
  //     .exists()
  //     .withMessage("Resume file is required.")
  //     .isString()
  //     .withMessage("Resume must be a string.")
  //     .custom((value) => {
  //       if (!value.endsWith(".pdf")) {
  //         throw new Error("Resume must be a PDF file.");
  //       }
  //       return true;
  //     }),
  // ],
  isAuth,
  authorizeRoles(["student"]),
  studentController.addDetails
);

export default router;
