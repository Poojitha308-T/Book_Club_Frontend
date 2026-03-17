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
    // Added transition-colors to the root container to handle the sidebar background shift
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* 1. SIDEBAR: Ensure Sidebar internal classes use dark:bg-slate-900 or similar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* 2. MAIN WRAPPER */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-64">
        
        {/* 3. NAVBAR: backdrop-blur looks best when transition-colors is applied */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* 4. MAIN CONTENT: 
            Added duration-500 here as well to match the Navbar's transition speed */}
        <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>

        <Footer />
      </div>

      {/* Suggestion Modal */}
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