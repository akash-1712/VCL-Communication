# VCL Communication

## Project Overview

VCL Communication is a web application built using the MERN stack and TypeScript. It allows students and staff to manage personal details and resumes efficiently. Students can log in to enter their personal information and upload their resumes, while staff can view the upload history and download resumes in a user-friendly interface.

## Features

1. **User Authentication:**

   - A login page with two default user roles: **Student** and **Staff**.
   - Any name and password can be used as credentials.

2. **Student Web Page:**

   - Students can log in and enter personal details including:
     - Name
     - Email
     - Contact Number
   - Ability to upload a resume in PDF format only.

3. **Staff Web Page:**
   - Staff can log in and access the upload history, which includes:
     - Details of the students
     - Date and time of resume uploads
     - Options to view and download resumes in a tabular format.

## Tech Stack

- **Frontend:**

  - React.js
  - TypeScript
  - Tailwind CSS

- **Backend:**

  - Node.js
  - Express.js
  - MongoDB

- **File Storage:**
  - Firebase

## Features Overview

- Role-based protected routes implemented for both frontend and backend to ensure that only authorized users can access specific pages.

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd vcl-communication
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   Create a .env file in the backend directory and configure your Firebase credentials and MongoDB connection string.
   ```
4. Run the application:
   ```bash
   npm run dev
   ```
