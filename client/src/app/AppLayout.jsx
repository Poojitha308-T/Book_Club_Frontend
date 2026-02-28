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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onOpenSuggestionModal={() => setSuggestionModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 md:p-10 overflow-auto">
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