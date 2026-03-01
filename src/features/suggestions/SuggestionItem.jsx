import React from "react";
import VoteButton from "./VoteButton";
import { approveSuggestion } from "@/services/suggestionService";
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
    <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
      <div>
        <h4 className="font-semibold text-lg">{suggestion.title}</h4>
        <p className="text-gray-500">Author: {suggestion.author}</p>
        {suggestion.description && <p className="text-gray-500">{suggestion.description}</p>}
        <p className="text-sm text-gray-400">Suggested by: {suggestion.suggested_by_name}</p>
      </div>

      <div className="flex items-center space-x-2">
        <VoteButton
          suggestionId={suggestion.id}
          votesCount={suggestion.votes_count}
          onVote={onRefresh}
        />

        {isAdmin && suggestion.status === "open" && (
          <button
            onClick={handleApprove}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Approve
          </button>
        )}

        {suggestion.status === "approved" && (
          <span className="text-green-600 font-semibold">Approved</span>
        )}
      </div>
    </div>
  );
};

export default SuggestionItem;