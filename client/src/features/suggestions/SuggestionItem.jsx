// src/features/suggestions/SuggestionItem.jsx
import React from "react";
import VoteButton from "./VoteButton";
import { approveSuggestion } from "../../services/suggestionService";
import { toast } from "react-toastify";

const SuggestionItem = ({ suggestion, onRefresh, user }) => {
  const isAdmin = user?.role === "admin";

  const handleApprove = async () => {
    try {
      await approveSuggestion(suggestion.id);
      toast.success("Suggestion approved!");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    }
  };

  return (
    <div className="border p-3 rounded flex justify-between items-center mb-2">
      <div>
        <h3 className="font-bold">{suggestion.title}</h3>
        <p className="text-sm">{suggestion.author}</p>
        <p className="text-gray-600">{suggestion.description}</p>
        <p className="text-xs text-gray-400">
          Suggested by: {suggestion.suggested_by_name}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <VoteButton
          suggestionId={suggestion.id}
          votesCount={suggestion.votes_count}
          onVote={onRefresh}
        />
        {isAdmin && suggestion.status !== "approved" && (
          <button
            onClick={handleApprove}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Approve
          </button>
        )}
      </div>
    </div>
  );
};

export default SuggestionItem;