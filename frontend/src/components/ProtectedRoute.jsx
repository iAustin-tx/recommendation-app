import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const { user, isAuthenticated } = useAuth();

  // User must be logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
