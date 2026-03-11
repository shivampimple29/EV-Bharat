import { Navigate } from "react-router-dom";

export function ProtectedRoutes({ children, role }) {
  
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}