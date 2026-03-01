import React, { useState } from "react";
import { voteSuggestion } from "@/services/suggestionService";
import { toast } from "react-toastify";

const VoteButton = ({ suggestionId, votesCount, onVote }) => {
  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    setLoading(true);
    try {
      await voteSuggestion(suggestionId);
      toast.success("Voted!");
      onVote();
    } catch (err) {
      toast.error(err.response?.data?.message || "Voting failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
    >
      {loading ? "Voting..." : `Vote (${votesCount})`}
    </button>
  );
};

export default VoteButton;