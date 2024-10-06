import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../store/AuthContext";
import {
  toastifyError,
  toastifySuccess,
} from "../../Helpers/notificationToastify";
import StudentContext from "../../store/StudentContext";

interface StudentContextProviderProps {
  children: ReactNode;
}

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

export function StudentContextProvider({
  children,
}: StudentContextProviderProps) {
  const [resume, setResume] = useState<ResumeCredentials>({
    name: "Resume",
    email: "",
    contactNumber: "",
    resumeUrl: "",
  });
  const [details, setDetails] = useState<boolean>(false);

  const { isLoggedIn, role, token } = useContext(AuthContext);

  const getStudentDetails = useCallback(
    async function () {
      if (isLoggedIn && token && role === "student") {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/student/getDetails`,
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );

          const resData: {
            message: string;
            isDetails: boolean;
            resume: ResumeCredentials;
          } = await response.json();

          if (!response.ok) {
            throw new Error(resData.message);
          }

          console.log(resData);
          if (resData.isDetails) {
            setResume(resData.resume);
            setDetails(resData.isDetails);
          }
        } catch (error) {
          toastifyError((error as Error).message || "Internal Server Error");
          throw error;
        }
      } else {
        setResume({ name: "", email: "", contactNumber: "", resumeUrl: "" });
        setDetails(false);
      }
    },
    [isLoggedIn, role, token]
  );

  useEffect(
    function () {
      getStudentDetails();
    },
    [getStudentDetails]
  );

  async function addDetails(data: StudentCredentials): Promise<void> {
    try {
      if (isLoggedIn && role === "student" && token) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/student/addDetails`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "content-type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        const resData: { message: string } = await response.json();

        if (!response.ok) {
          throw new Error(resData.message);
        }

        await getStudentDetails();

        toastifySuccess("Added Details Successfully");
      }
    } catch (error) {
      toastifyError((error as Error).message || "Internal Server Error");
      throw error;
    }
  }

  async function editDetails(data: StudentCredentials): Promise<void> {
    try {
      if (isLoggedIn && role === "student" && token) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/student/editDetails`,
          {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
              "content-type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        const resData: { message: string } = await response.json();

        if (!response.ok) {
          throw new Error(resData.message);
        }

        await getStudentDetails();

        toastifySuccess("Edit Details Successfully");
      }
    } catch (error) {
      toastifyError((error as Error).message || "Internal Server Error");
      throw error;
    }
  }

  const studentCtxValue = {
    isDetails: details,
    resume,
    getDetails: getStudentDetails,
    addDetails,
    editDetails,
  };

  return (
    <StudentContext.Provider value={studentCtxValue}>
      {children}
    </StudentContext.Provider>
  );
}
