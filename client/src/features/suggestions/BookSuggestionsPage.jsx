import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSuggestions, createSuggestion, voteSuggestion, approveSuggestion } from "@/services/suggestionService";

const BookSuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSuggestion, setNewSuggestion] = useState({
    title: "",
    author: "",
    description: "",
  });

  const isAdmin = localStorage.getItem("role") === "admin";

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const data = await getSuggestions();
      console.log("Fetched suggestions:", data);
      setSuggestions(data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleChange = (e) => setNewSuggestion({ ...newSuggestion, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSuggestion.title || !newSuggestion.author) {
      toast.error("Title and Author are required");
      return;
    }

    try {
      await createSuggestion(newSuggestion);
      toast.success("Suggestion added successfully!");
      setNewSuggestion({ title: "", author: "", description: "" });
      fetchSuggestions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add suggestion");
    }
  };

  const handleVote = async (id) => {
    try {
      await voteSuggestion(id);
      fetchSuggestions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to vote");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveSuggestion(id);
      fetchSuggestions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Book Suggestions</h2>

      {/* Suggestion Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h3 className="font-semibold text-lg">Suggest a Book</h3>
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={newSuggestion.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={newSuggestion.author}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={newSuggestion.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Add Suggestion
        </button>
      </form>

      {/* Suggestions List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading suggestions...</p>
        ) : suggestions.length === 0 ? (
          <p className="text-gray-500">No suggestions yet.</p>
        ) : (
          suggestions.map((s) => (
            <div
              key={s.id}
              className="bg-white p-4 rounded-2xl shadow-md flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0"
            >
              <div>
                <h4 className="font-semibold text-lg">{s.title}</h4>
                <p className="text-gray-500">Author: {s.author}</p>
                {s.description && <p className="text-gray-500">{s.description}</p>}
                <p className="text-sm text-gray-400">Suggested by: {s.suggested_by_name}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button onClick={() => handleVote(s.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Vote ({s.votes_count})
                </button>

                {isAdmin && s.status === "open" && (
                  <button onClick={() => handleApprove(s.id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Approve
                  </button>
                )}

                {s.status === "approved" && <span className="text-sm text-green-600 font-semibold">Approved</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookSuggestionsPage;