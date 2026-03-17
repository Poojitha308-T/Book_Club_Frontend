import React from "react";
import SuggestionList from "./SuggestionList";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import
import { Sparkles, Compass } from "lucide-react";

const BookSuggestionsPage = () => {
  const token = localStorage.getItem("token");

  let user = {
    role: "user",
    name: "Guest",
    email: "",
  };

  if (token) {
    try {
      const decoded = jwtDecode(token);

      user = {
        role: decoded?.role || "user",
        name: decoded?.name || "User",
        email: decoded?.email || "",
      };
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors duration-500">
      <div className="max-w-7xl mx-auto p-6 sm:p-10 space-y-10">
        
        {/* Header Section */}
        <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-500/20 w-fit">
              <Sparkles className="text-indigo-600 dark:text-indigo-400" size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-300">
                Tailored for you
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
              <Compass className="text-indigo-600 dark:text-indigo-500" size={40} />
              Book Suggestions
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
              Explore a curated list of masterpieces chosen based on your reading history and community trends.
            </p>
          </div>

          {/* User Badge Display */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="relative">
          {/* Subtle background glow for Dark Mode */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <SuggestionList user={user} />
          </div>
        </main>

      </div>
    </div>
  );
};

export default BookSuggestionsPage;