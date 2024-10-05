import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import Resume from "../models/resume";
const { storage } = require("../plugin/firebase/firebase");
const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  deleteObject,
  getStreamFromUrl,
} = require("firebase/storage");
const { uuidv4 } = require("@firebase/util");

interface CustomError extends Error {
  code?: number;
  data?: any;
}

interface CustomRequest extends Request {
  role?: string;
  userId?: string;
}

exports.addDetails = async function (
  req: CustomRequest,
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

    const { name, email, contactNumber, resume: file } = req.body;
    const userId = req.userId;

    // const base64 = file.base64;
    // console.log(base64);
    // const base64Data = base64.replace(/^data:application\/pdf;base64,/, "");

    // const arrayBuffer = Uint8Array.from(atob(base64Data), (c) =>
    //   c.charCodeAt(0)
    // ).buffer;

    // const blob = new Blob([arrayBuffer], { type: "application/pdf" });

    // const fileRef = ref(storage, `VCL/${uuidv4()}`);
    // const snapshot = await uploadBytesResumable(fileRef, blob);

    // const downloadURL = await getDownloadURL(fileRef);

    const resume = new Resume({
      studentId: userId,
      name,
      email,
      contactNumber,
      resumeUrl: "sfddsf",
    });

    await resume.save();

    res.status(200).json({
      message: "done",
      // pdfLink: downloadURL,
      // file_Id: snapshot.metadata.name,
    });
  } catch (error) {
    next(error);
  }
};
