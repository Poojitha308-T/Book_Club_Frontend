import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createSuggestion, getSuggestions, voteSuggestion, approveSuggestion } from "@/services/suggestionService";

const SuggestionModal = ({ isOpen, onClose }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
  });

  // Fetch suggestions
  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const data = await getSuggestions();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new suggestion
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSuggestion(formData);
      toast.success("Book suggestion added!");
      setFormData({ title: "", author: "", description: "" });
      fetchSuggestions(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create suggestion");
    }
  };

  // Vote for a suggestion
  const handleVote = async (id) => {
    try {
      await voteSuggestion(id);
      toast.success("Vote added!");
      fetchSuggestions();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Vote failed");
    }
  };

  // Approve suggestion (admin)
  const handleApprove = async (id) => {
    try {
      await approveSuggestion(id);
      toast.success("Suggestion approved!");
      fetchSuggestions();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Approval failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Book Suggestions</h2>

        {/* Suggestion Form */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Submit Suggestion
          </button>
        </form>

        {/* Suggestions List */}
        {loading ? (
          <p className="text-gray-500">Loading suggestions...</p>
        ) : suggestions.length === 0 ? (
          <p className="text-gray-500">No suggestions yet.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {suggestions.map((sug) => (
              <li
                key={sug.id}
                className="flex justify-between items-start border p-3 rounded-lg shadow-sm"
              >
                <div>
                  <h3 className="font-semibold text-lg">{sug.title}</h3>
                  <p className="text-gray-500 text-sm">{sug.author}</p>
                  <p className="text-gray-400 text-sm mt-1">{sug.description}</p>
                  <p className="text-gray-400 text-xs mt-1">Votes: {sug.votes_count}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Suggested by: {sug.suggested_by_name}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleVote(sug.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Vote
                  </button>
                  {sug.status === "open" && sug.isAdmin && (
                    <button
                      onClick={() => handleApprove(sug.id)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SuggestionModal;