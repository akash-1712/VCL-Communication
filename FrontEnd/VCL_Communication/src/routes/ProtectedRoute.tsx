import { FC, ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../store/AuthContext";
import { toastifyWarning } from "../Helpers/notificationToastify";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isLoggedIn, role } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  if (!isLoggedIn || (allowedRoles && !allowedRoles.includes(role))) {
    toastifyWarning("Not Authorized to access this Route.");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
