// src/features/voting/components/VotingCard.jsx
import React, { useState } from "react";
import { Button, Card, Badge } from "../../components/ui";
import { voteBook } from "../voting.api";

const VotingCard = ({ book, onVote }) => {
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState(book.vote_count || 0);

  const handleVote = async () => {
    setLoading(true);
    try {
      await voteBook(book.id);
      setVotes(votes + 1); // optimistic update
      if (onVote) onVote(book.id);
    } catch (error) {
      console.error("Vote failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 flex flex-col justify-between space-y-3">
      <div>
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-600">by {book.author}</p>
        <p className="mt-2 text-gray-700">{book.description}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <Badge variant="secondary">{votes} votes</Badge>
        <Button size="sm" onClick={handleVote} disabled={loading}>
          {loading ? "Voting..." : "Vote"}
        </Button>
      </div>
    </Card>
  );
};

export default VotingCard;