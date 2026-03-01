import React, { useContext } from "react";
import Router from "@/app/router.jsx";
import { AuthProvider, AuthContext } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;

  return <Router isAuthenticated={isAuthenticated} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;