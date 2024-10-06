import { createContext } from "react";

interface ResumeDownloadCredentials {
  username: string;
}

interface ResumeDetails {
  name: string;
  email: string;
  contactNumber: string;
  resumeUrl: string;
  uploadDate: string;
}

interface StudentDetails {
  username: string;
  resumeDetails: ResumeDetails;
}

interface StaffContextTypes {
  studentDetails: StudentDetails[];
  getStudentsDetails: () => Promise<void>;
  downloadStudentResume: (data: ResumeDownloadCredentials) => Promise<void>;
}

const initialStaffValue: StaffContextTypes = {
  studentDetails: [],
  getStudentsDetails: async () => {},
  downloadStudentResume: async () => {},
};

const StaffContext = createContext(initialStaffValue);

export default StaffContext;
