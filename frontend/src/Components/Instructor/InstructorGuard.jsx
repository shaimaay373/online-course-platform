import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function InstructorGuard({ children }) {
  const { token, user } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user?.role !== "instructor") {
    return <Navigate to="/courses" replace />;
  }
  return children;
}
