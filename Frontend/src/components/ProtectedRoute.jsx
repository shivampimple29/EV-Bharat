import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  // Still checking localStorage / fetching user
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  // Not logged in → go to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Logged in but wrong role → go home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // All good → render the page
  return children;
}

export default ProtectedRoute;
