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
          path="/protected"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <h1>this path is protected</h1>
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </Fragment>
  );
}

export default App;
