import { createContext } from "react";

interface StudentCredentials {
  name: string;
  email: string;
  contactNumber: string;
  isResume: boolean;
  resume: string | null;
}

interface ResumeCredentials {
  name: string;
  email: string;
  contactNumber: string;
  resumeUrl: string;
}

interface StudentContextType {
  isDetails: boolean;
  resume: ResumeCredentials;
  getDetails: () => Promise<void>;
  addDetails: (data: StudentCredentials) => Promise<void>;
  editDetails: (data: StudentCredentials) => Promise<void>;
}

const initialStudentValue: StudentContextType = {
  isDetails: false,
  resume: { name: "", email: "", contactNumber: "", resumeUrl: "" },
  getDetails: async () => {},
  addDetails: async () => {},
  editDetails: async () => {},
};

const StudentContext = createContext(initialStudentValue);

export default StudentContext;
