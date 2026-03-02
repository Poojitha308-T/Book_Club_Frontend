// src/features/goals/components/AddGoalForm.jsx
import { useState } from "react";
import { addGoal } from "../goals.api";
import { toast } from "react-toastify";

const AddGoalForm = ({ onGoalAdded }) => {
  const [targetBooks, setTargetBooks] = useState(0);
  const [targetPages, setTargetPages] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (targetBooks <= 0 || targetPages <= 0 || !startDate || !endDate) {
      toast.error("Please fill all fields correctly");
      return;
    }

    try {
      setLoading(true);
      const newGoal = await addGoal({
        targetBooks: Number(targetBooks),
        targetPages: Number(targetPages),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      toast.success("Goal added!");
      onGoalAdded(newGoal);

      setTargetBooks(0);
      setTargetPages(0);
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to add goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow-md space-y-2">
      <h3 className="font-semibold text-lg">Add New Goal</h3>

      <input
        type="number"
        placeholder="Target Books"
        value={targetBooks}
        onChange={(e) => setTargetBooks(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
      />

      <input
        type="number"
        placeholder="Target Pages"
        value={targetPages}
        onChange={(e) => setTargetPages(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition font-medium"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Goal"}
      </button>
    </form>
  );
};

export default AddGoalForm;