import React, { useEffect, useState } from "react";
import { getSuggestions } from "@/services/suggestionService";
import SuggestionItem from "./SuggestionItem";
import SuggestionModal from "./SuggestionModal";
import { toast } from "react-toastify";

const SuggestionList = ({ user }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  // Fetch all suggestions from backend
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const data = await getSuggestions();
      setSuggestions(data || []);
    } catch (err) {
      console.error("Failed to load suggestions:", err.response?.data || err.message);
      toast.error("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-2xl font-bold">Book Suggestions</h2>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          onClick={() => setModalOpen(true)}
        >
          Add Suggestion
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 text-center mt-4">Loading suggestions...</p>
      )}

      {/* Suggestion list */}
      {!loading && suggestions.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No suggestions yet.</p>
      )}

      <div className="space-y-4">
        {!loading &&
          suggestions.map((s) => (
            <SuggestionItem
              key={s.id}
              suggestion={s}
              user={user}
              onRefresh={fetchSuggestions} // refresh list after vote/approve
            />
          ))}
      </div>

      {/* Modal for adding suggestion */}
      <SuggestionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchSuggestions} // refresh after adding new suggestion
      />
    </div>
  );
};

export default SuggestionList;