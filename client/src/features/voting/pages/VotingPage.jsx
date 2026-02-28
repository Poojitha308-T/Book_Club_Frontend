// src/features/voting/pages/VotingPage.jsx
import React, { useEffect, useState } from "react";
import VotingCard from "../components/VotingCard";
import { fetchVotingBooks } from "../voting.api";
import { PageHeader } from "../../components/common";

const VotingPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await fetchVotingBooks();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch voting books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteUpdate = (bookId) => {
    // Optional: refresh or reorder top voted books
    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.id === bookId ? { ...b, vote_count: (b.vote_count || 0) + 1 } : b
      )
    );
  };

  useEffect(() => {
    loadBooks();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading books...</p>;

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Vote for Your Favorite Book" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <VotingCard key={book.id} book={book} onVote={handleVoteUpdate} />
        ))}
      </div>
    </div>
  );
};

export default VotingPage;