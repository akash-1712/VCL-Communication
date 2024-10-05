import express, { Request, Response, NextFunction } from "express";
import { check, body } from "express-validator";
import dotenv from "dotenv";
const staffController = require("../controllers/staff");
const isAuth = require("../middlewares/is-auth");
const authorizeRoles = require("../middlewares/authorize");

dotenv.config();

const router = express.Router();

//-------------------------------- Get Students Details --------------------------------
router.get(
  "/studentDetails",
  isAuth,
  authorizeRoles(["staff"]),
  staffController.getStudentDetails
);

//-------------------------------- Download Resume Of A Student --------------------------------
router.post(
  "/downloadResume",
  [check("username").notEmpty().withMessage("username is required.")],
  isAuth,
  authorizeRoles(["staff"]),
  staffController.downloadFile
);
export default router;
