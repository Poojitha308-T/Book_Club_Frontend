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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Add New Goal
      </h3>

      <input
        type="number"
        placeholder="Target Books"
        value={targetBooks}
        onChange={(e) => setTargetBooks(e.target.value)}
        className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      <input
        type="number"
        placeholder="Target Pages"
        value={targetPages}
        onChange={(e) => setTargetPages(e.target.value)}
        className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg transition font-medium disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Goal"}
      </button>
    </form>
  );
};

export default AddGoalForm;