// src/features/suggestions/SuggestionList.jsx
import React, { useEffect, useState } from "react";
import { getSuggestions } from "../../services/suggestionService";
import SuggestionItem from "./SuggestionItem";
import SuggestionModal from "./SuggestionModal";
import { toast } from "react-toastify";

const SuggestionList = ({ user }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSuggestions = async () => {
    try {
      const data = await getSuggestions();
      setSuggestions(data);
    } catch (err) {
      toast.error("Failed to load suggestions");
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Book Suggestions</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setModalOpen(true)}
        >
          Add Suggestion
        </button>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions yet.</p>
      ) : (
        suggestions.map((s) => (
          <SuggestionItem
            key={s.id}
            suggestion={s}
            user={user}
            onRefresh={fetchSuggestions}
          />
        ))
      )}

      <SuggestionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchSuggestions}
      />
    </div>
  );
};

export default SuggestionList;