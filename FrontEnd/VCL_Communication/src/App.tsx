import { Fragment, useContext } from "react";
import Notification from "./components/notification/Notification";
import { createPortal } from "react-dom";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import NavBar from "./components/navBar/NavBar";
import AuthContext from "./store/AuthContext";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentProfile from "./pages/student/StudentProfile";
import AddDetails from "./pages/student/AddDetailsForm";
import StudentDetailsPage from "./pages/staff/StudentDetails";

function App() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Fragment>
      {createPortal(
        <Notification />,
        document.getElementById("notification") as HTMLElement
      )}
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={isLoggedIn ? <HomePage /> : <Login />} />
        <Route
          path="/signUp"
          element={isLoggedIn ? <HomePage /> : <SignUp />}
        />
        <Route
          path="/studentDetails"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StudentDetailsPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/studentProfile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              {<StudentProfile />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/addDetails"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              {<AddDetails />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/editDetails"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              {<AddDetails />}
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Fragment>
  );
}

export default App;
