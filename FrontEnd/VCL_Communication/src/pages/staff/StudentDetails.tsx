import React, { useContext, useEffect, useState } from "react";
import StaffContext from "../../store/StaffContext";

const StudentDetailsPage: React.FC = () => {
  const { studentDetails, getStudentsDetails, downloadStudentResume } =
    useContext(StaffContext);

  const [loadingDetails, setLoadingDetails] = useState<boolean>(true);
  const [loadingDownload, setLoadingDownload] = useState<string | null>(null);

  function formateDate(dateString: string): string {
    if (!dateString) {
      return "";
    }
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getUTCHours() + 5.5).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}`;
    return formattedDateTime;
  }

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        await getStudentsDetails();
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchStudentDetails();
  }, [getStudentsDetails]);

  const handleDownload = async (username: string) => {
    setLoadingDownload(username);
    try {
      await downloadStudentResume({ username });
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoadingDownload(null);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Student Details</h2>
      {loadingDetails ? (
        <div className="text-center">Loading student details...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  username
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Resume Uploaded On
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  View Resume
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Download Resume
                </th>
              </tr>
            </thead>
            <tbody>
              {studentDetails.length > 0 ? (
                studentDetails.map((student) => (
                  <tr key={student.username}>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {student.username || "Not Found"}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {student.resumeDetails.name || "Not Found"}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {student.resumeDetails.email || "Not Found"}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {student.resumeDetails.contactNumber || "Not Found"}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {formateDate(student.resumeDetails.uploadDate) ||
                        "Not Found"}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {student.resumeDetails.resumeUrl ? (
                        <a
                          href={student.resumeDetails.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <p>Not Found</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {student.resumeDetails.resumeUrl ? (
                        <button
                          onClick={() => handleDownload(student.username)}
                          className="text-blue-500 hover:underline"
                          disabled={loadingDownload === student.username}
                        >
                          {loadingDownload === student.username
                            ? "Downloading..."
                            : "Download"}
                        </button>
                      ) : (
                        <p>Not Found</p>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentDetailsPage;
