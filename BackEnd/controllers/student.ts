import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import Resume from "../models/resume";
import User from "../models/user";
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

//-------------------------------- Delete Pre-Existing File In Case New Upload --------------------------------
async function deleteFile(publicId: string) {
  const fileRef = ref(storage, `VCL/${publicId}`);
  await deleteObject(fileRef);
}

//-------------------------------- Upload PDF File --------------------------------
async function uploadFile(file: { base64: any }) {
  const fileRef = ref(storage, `VCL/${uuidv4()}`);
  const snapshot = await uploadString(fileRef, file, "data_url");
  const downloadURL = await getDownloadURL(fileRef);
  return { url: downloadURL, publicId: snapshot.metadata.name };
}

//-------------------------------- Get Student Details --------------------------------
exports.getDetails = async function (
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

    const userId = req.userId;

    const isUser = await User.findById(userId);

    if (!isUser) {
      throw new Error("User not found");
    }

    const isResume = await Resume.findOne(
      { studentId: userId },
      { _id: 0, name: 1, email: 1, contactNumber: 1, resumeUrl: 1 }
    );

    if (!isResume) {
      res.status(200).json({
        message: "Not Details Found.",
        isDetails: false,
      });
    } else {
      res.status(200).json({
        message: "Details Found.",
        isDetails: true,
        resume: isResume,
      });
    }
  } catch (error) {
    next(error);
  }
};

//-------------------------------- Add Student Details --------------------------------
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

    const isUser = await User.findById(userId);

    if (!isUser) {
      throw new Error("User not found");
    }

    const isResume = await Resume.findOne({ studentId: userId });

    if (isResume) {
      throw new Error("Resume Details already exists");
    }

    const uploadDetails = await uploadFile(file);

    if (!uploadDetails || !uploadDetails.url || !uploadDetails.publicId) {
      throw new Error("Error During uploading");
    }
    const resume = new Resume({
      studentId: userId,
      name,
      email,
      contactNumber,
      resumeUrl: uploadDetails.url,
      publicId: uploadDetails.publicId,
    });

    await resume.save();

    res.status(200).json({
      message: "done",
      pdfLink: uploadDetails.url,
    });
  } catch (error) {
    next(error);
  }
};

//-------------------------------- Edit Student Details --------------------------------
exports.editDetails = async function (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    console.log("Validation errors: " + errors);

    if (!errors.isEmpty()) {
      const error: CustomError = new Error(errors.array()[0].msg);
      error.code = 422;
      error.data = errors.array();
      throw error;
    }

    const { name, email, contactNumber, isResume, resume: file } = req.body;
    const userId = req.userId;

    const isUser = await User.findById(userId);

    if (!isUser) {
      throw new Error("User not found");
    }

    const resume = await Resume.findOne({ studentId: userId });

    if (!resume) {
      throw new Error("No Details found");
    }

    if (isResume) {
      await deleteFile(resume.publicId);
      console.log("file deleted successfully");
      const uploadDetails = await uploadFile(file);
      if (!uploadDetails || !uploadDetails.url || !uploadDetails.publicId) {
        throw new Error("Error During uploading");
      }
      resume.publicId = uploadDetails.publicId;
      resume.resumeUrl = uploadDetails.url;
    }
    resume.name = name;
    resume.email = email;
    resume.contactNumber = contactNumber;
    resume.uploadDate = new Date();

    const updatedResume = await resume.save();

    res.status(200).json({
      message: "Details updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    next(error);
  }
};
