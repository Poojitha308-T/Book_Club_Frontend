// src/features/goals/components/GoalCard.jsx
import React, { useState } from "react";
import ProgressBar from "@/features/progress/components/ProgressBar";
import { updateGoalProgress, deleteGoal } from "../goals.api";
import { toast } from "react-toastify";

const GoalCard = ({ goal, onGoalUpdated, onGoalDeleted }) => {
  const {
    id,
    target_books,
    target_pages,
    completed_books,
    completed_pages,
    start_date,
    end_date,
  } = goal;

  const [loading, setLoading] = useState(false);

  const handleUpdateProgress = async (newCompletedBooks, newCompletedPages) => {
    if (newCompletedBooks < 0 || newCompletedBooks > target_books) return;
    if (newCompletedPages < 0 || newCompletedPages > target_pages) return;

    try {
      setLoading(true);
      const updatedGoal = await updateGoalProgress({
        goalId: id,
        completedBooks: newCompletedBooks,
        completedPages: newCompletedPages,
      });
      onGoalUpdated(updatedGoal);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update goal");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteGoal({ goalId: id });
      onGoalDeleted(id);
      toast.success("Goal deleted!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to delete goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md space-y-2">
      <h3 className="font-semibold text-lg">
        Goal ({new Date(start_date).toLocaleDateString()} -{" "}
        {new Date(end_date).toLocaleDateString()})
      </h3>
      <p className="text-gray-500 text-sm">
        Books: {completed_books}/{target_books} | Pages: {completed_pages}/{target_pages}
      </p>

      <ProgressBar progress={completed_books} max={target_books} label="Books" />
      <ProgressBar progress={completed_pages} max={target_pages} label="Pages" />

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => handleUpdateProgress(completed_books + 1, completed_pages)}
          disabled={loading || completed_books >= target_books}
          className="bg-green-500 text-white px-3 py-1 rounded-xl hover:bg-green-600 transition font-medium disabled:opacity-50"
        >
          +Book
        </button>
        <button
          onClick={() => handleUpdateProgress(completed_books, completed_pages + 10)}
          disabled={loading || completed_pages >= target_pages}
          className="bg-yellow-500 text-white px-3 py-1 rounded-xl hover:bg-yellow-600 transition font-medium disabled:opacity-50"
        >
          +10 Pages
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600 transition font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GoalCard;