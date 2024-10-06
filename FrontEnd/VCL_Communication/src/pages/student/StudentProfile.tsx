import { useContext, useEffect, useState } from "react";
import StudentContext from "../../store/StudentContext";
import AuthContext from "../../store/AuthContext";
import { Link } from "react-router-dom";

const StudentProfile: React.FC = () => {
  const { isDetails, resume, getDetails } = useContext(StudentContext);
  const { username } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      await getDetails();
      setLoading(false);
    };

    loadDetails();
  }, [getDetails]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        Profile of {username}
      </h1>

      {!isDetails ? (
        <div className="flex justify-center">
          <Link
            to="/addDetails"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Add Details
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Details</h2>
            <p>
              <strong>Name:</strong> {resume.name}
            </p>
            <p>
              <strong>Email:</strong> {resume.email}
            </p>
            <p>
              <strong>Contact Number:</strong> {resume.contactNumber}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Resume</h2>
            <p>
              <strong>Resume URL:</strong> {resume.resumeUrl}
            </p>
            {resume.resumeUrl && (
              <a
                href={resume.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Preview
              </a>
            )}
          </div>

          <div className="flex justify-center">
            <Link
              to="/editDetails"
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
            >
              Edit Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
