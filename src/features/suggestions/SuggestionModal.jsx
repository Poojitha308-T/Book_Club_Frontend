import { useState } from "react";
import { createSuggestion } from "@/services/suggestionService";
import { toast } from "react-toastify";

const SuggestionModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ title: "", author: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author) {
      toast.error("Title and Author are required");
      return;
    }

    try {
      setLoading(true);
      await createSuggestion(formData);
      toast.success("Suggestion added!");
      setFormData({ title: "", author: "", description: "" });
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create suggestion");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Add Book Suggestion</h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {loading ? "Submitting..." : "Submit Suggestion"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuggestionModal;