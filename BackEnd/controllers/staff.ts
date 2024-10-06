import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import Resume from "../models/resume";
import axios from "axios";
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

//-------------------------------- Get Download Url --------------------------------
async function downloadFileFromFirebase(publicId: string) {
  if (!publicId) {
    throw new Error("No Resume Found. ");
  }
  const fileRef = ref(storage, `VCL/${publicId}`);
  const downloadUrl = await getDownloadURL(fileRef);
  return downloadUrl;
}

//-------------------------------- Get Student Details --------------------------------
exports.getStudentDetails = async function (
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

    const studentsWithResumes = await User.aggregate([
      {
        $match: {
          role: "student",
        },
      },
      {
        $lookup: {
          from: "resumes",
          localField: "_id",
          foreignField: "studentId",
          as: "resumeDetails",
        },
      },
      {
        $unwind: {
          path: "$resumeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          username: 1,
          resumeDetails: {
            $ifNull: [
              {
                name: "$resumeDetails.name",
                email: "$resumeDetails.email",
                contactNumber: "$resumeDetails.contactNumber",
                resumeUrl: "$resumeDetails.resumeUrl",
                uploadDate: "$resumeDetails.uploadDate",
              },
              {},
            ],
          },
        },
      },
    ]);

    res.status(200).json({
      message: "find student Details",
      studentDetails: studentsWithResumes,
    });
  } catch (error) {
    next(error);
  }
};

//-------------------------------- Download Resume --------------------------------
exports.downloadFile = async function (
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

    const { username } = req.body;
    const userId = req.userId;

    const isUser = await User.findById(userId);

    if (!isUser) {
      throw new Error("User not found");
    }

    const getUserWithResume = await User.aggregate([
      { $match: { username } },
      {
        $lookup: {
          from: "resumes",
          localField: "_id",
          foreignField: "studentId",
          as: "resumeDetails",
        },
      },
      {
        $unwind: {
          path: "$resumeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          username: 1,
          "resumeDetails.resumeUrl": 1,
          "resumeDetails.publicId": 1,
        },
      },
    ]);

    if (!getUserWithResume || getUserWithResume.length === 0) {
      throw new Error("No Resume Details Found for user: " + username);
    }

    const downloadUrl = await downloadFileFromFirebase(
      getUserWithResume?.[0]?.resumeDetails?.publicId
    );

    const response = await axios.get(downloadUrl, {
      responseType: "arraybuffer",
    });
    res.setHeader("Content-Type", "application/pdf");
    res.send(response.data);
  } catch (error) {
    next(error);
  }
};
