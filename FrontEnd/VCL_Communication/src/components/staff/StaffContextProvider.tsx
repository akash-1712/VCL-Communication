import { ReactNode, useContext, useState } from "react";
import { toastifyError } from "../../Helpers/notificationToastify";
import StaffContext from "../../store/StaffContext";
import AuthContext from "../../store/AuthContext";

interface StaffContextProviderProps {
  children: ReactNode;
}

interface ResumeDownloadCredentials {
  username: string;
}

export function StaffContextProvider({ children }: StaffContextProviderProps) {
  const { isLoggedIn, token, role } = useContext(AuthContext);
  const [studentDetails, setStudentDetails] = useState([]);

  async function getStudentsDetails() {
    try {
      if (isLoggedIn && token && role === "staff") {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/staff/studentDetails`,
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
            studentDetails: [];
          } = await response.json();

          if (!response.ok) {
            throw new Error(resData.message);
          }

          setStudentDetails(resData.studentDetails);
        } catch (error) {
          toastifyError((error as Error).message || "Internal Server Error");
          throw error;
        }
      }
    } catch (error) {
      toastifyError((error as Error).message || "Internal Server Error");
    }
  }

  async function downloadStudentResume(data: ResumeDownloadCredentials) {
    try {
      if (isLoggedIn && role === "staff" && token) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/staff/downloadResume`,
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

        const resData: { message: string; downloadUrl: string } =
          await response.json();

        if (!response.ok) {
          throw new Error(resData.message);
        }

        console.log("Download URL: " + resData.downloadUrl);
      }
    } catch (error) {
      toastifyError((error as Error).message || "Internal Server Error");
      throw error;
    }
  }

  const staffCtxValue = {
    studentDetails,
    getStudentsDetails,
    downloadStudentResume,
  };
  return (
    <StaffContext.Provider value={staffCtxValue}>
      {children}
    </StaffContext.Provider>
  );
}
