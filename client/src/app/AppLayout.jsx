import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";
import SuggestionModal from "../features/suggestions/SuggestionModal";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      
      {/* Sidebar (desktop static, mobile slide) */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        
        <Navbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 md:p-8 bg-slate-100">
          <Outlet />
        </main>

        <Footer />
      </div>

      {suggestionModalOpen && (
        <SuggestionModal
          isOpen={suggestionModalOpen}
          onClose={() => setSuggestionModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;