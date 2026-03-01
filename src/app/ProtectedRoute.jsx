import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Role-based protection
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;