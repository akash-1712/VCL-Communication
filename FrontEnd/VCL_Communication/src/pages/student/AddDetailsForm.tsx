import { ChangeEvent, useContext, useEffect, useState } from "react";
import { toastifyError } from "../../Helpers/notificationToastify";
import StudentContext from "../../store/StudentContext";
import { useNavigate } from "react-router-dom";

interface StudentCredentials {
  name: string;
  email: string;
  contactNumber: string;
  resume: string | null;
  isResume: boolean;
}

const AddDetails: React.FC = () => {
  const [formData, setFormData] = useState<StudentCredentials>({
    name: "",
    email: "",
    contactNumber: "",
    resume: null,
    isResume: false,
  });

  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addDetails, editDetails, resume, isDetails } =
    useContext(StudentContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDetails) {
      setFormData({
        name: resume.name,
        email: resume.email,
        contactNumber: resume.contactNumber,
        resume: resume.resumeUrl,
        isResume: false,
      });
      setResumeFileName(resume ? "Current Resume" : null);
    }
  }, [isDetails, resume]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      toastifyError("File size should be less than 4MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setFormData({
          ...formData,
          resume: reader.result as string,
          isResume: true,
        });
        setResumeFileName(file.name);
      }
    };
    reader.onerror = () => toastifyError("File reading error");
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleFileChange(file);
    } else {
      toastifyError("Please upload a valid PDF file");
    }
  };

  const handleFileClick = () => {
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.resume && !isDetails) {
        toastifyError("Resume is required");
        return;
      }
      setIsLoading(true);

      if (isDetails) {
        await editDetails(formData);
      } else {
        formData.isResume = true;
        await addDetails(formData);
      }

      navigate("/studentProfile", { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          {isDetails ? "Edit Student Details" : "Add Student Details"}
        </h2>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="contactNumber"
            className="block text-gray-700 font-semibold"
          >
            Contact Number
          </label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div
          className={`border-2 ${
            isDragging ? "border-green-500" : "border-gray-300"
          } border-dashed p-6 rounded-md mb-4 text-center cursor-pointer`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleFileClick}
        >
          <p className="text-gray-700 font-semibold mb-2">
            "Drag and drop your resume (PDF only) or click to upload"
          </p>

          <input
            type="file"
            accept="application/pdf"
            ref={(input) => setFileInput(input)}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
            className="hidden"
          />
        </div>

        {resumeFileName && (
          <p className=" mb-4">
            Uploaded file:{" "}
            <strong>
              {resumeFileName}
              {formData.resume && !formData.isResume && (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600"
                  href={formData.resume}
                >
                  : Preview
                </a>
              )}
            </strong>
          </p>
        )}

        <button
          type="submit"
          className={`w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : isDetails ? "Update Details" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddDetails;
