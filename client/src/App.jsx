import Router from "@/app/router.jsx";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <Router />
      <ToastContainer position="top-right" />
    </AuthProvider>
  );
}

export default App;