import React, { useContext, useEffect } from "react";
import StaffContext from "../../store/StaffContext";

const StudentDetailsPage: React.FC = () => {
  const { studentDetails, getStudentsDetails, downloadStudentResume } =
    useContext(StaffContext);

  useEffect(() => {
    getStudentsDetails();
  }, [getStudentsDetails]);

  const handleDownload = async (username: string) => {
    await downloadStudentResume({ username });
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Student Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
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
                    {student.resumeDetails.name}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {student.resumeDetails.email}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {student.resumeDetails.contactNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {new Date().toLocaleString()}{" "}
                    {/* Replace with actual upload date */}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <a
                      href={student.resumeDetails.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <a
                      href={student.resumeDetails.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleDownload(student.username)}
                      className="text-blue-500 hover:underline"
                    >
                      Download
                    </a>
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
    </div>
  );
};

export default StudentDetailsPage;
