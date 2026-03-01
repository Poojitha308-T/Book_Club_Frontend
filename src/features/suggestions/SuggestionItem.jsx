import React, { useState } from "react";
import VoteButton from "./VoteButton";
import { approveSuggestion } from "@/services/suggestionService";
import { toast } from "react-toastify";

const SuggestionItem = ({ suggestion, onRefresh, user }) => {
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.role === "admin";

  const handleApprove = async () => {
    setLoading(true);
    try {
      const result = await approveSuggestion(suggestion.id);
      console.log("Approval result:", result);
      toast.success("Suggestion approved!");
      onRefresh && onRefresh(); // refresh parent list
    } catch (err) {
      console.error("Approval failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Approval failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
      {/* Left Section */}
      <div className="flex-1">
        <h4 className="font-semibold text-lg truncate">{suggestion.title}</h4>
        <p className="text-gray-500 text-sm mt-1">Author: {suggestion.author}</p>
        {suggestion.description && (
          <p className="text-gray-500 text-sm mt-1">{suggestion.description}</p>
        )}
        <p className="text-gray-400 text-xs mt-1">
          Suggested by: {suggestion.suggested_by_name}
        </p>
      </div>

      {/* Right Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 md:mt-0">
        <VoteButton
          suggestionId={suggestion.id}
          votesCount={suggestion.votes_count}
          onVote={onRefresh}
        />

        {/* Approve Button */}
        {isAdmin && suggestion.status === "open" && (
          <button
            onClick={handleApprove}
            disabled={loading}
            className={`px-3 py-1 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Approving..." : "Approve"}
          </button>
        )}

        {/* Status Badge */}
        {suggestion.status !== "open" && (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full mt-1 sm:mt-0 ${
              suggestion.status === "approved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {suggestion.status.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default SuggestionItem;