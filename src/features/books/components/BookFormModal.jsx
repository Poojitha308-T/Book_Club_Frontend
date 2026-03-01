// src/features/books/components/BookFormModal.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const BookFormModal = ({ isOpen, onClose, onSuccess, formData: initialData }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize form with provided data (for editing)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setAuthor(initialData.author || "");
      setGenre(initialData.genre || "");
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !author) {
      toast.error("Title and Author are required!");
      setLoading(false);
      return;
    }

    try {
      await onSuccess({ title, author, genre, description });
      toast.success(initialData ? "Book updated!" : "Book added!");
      onClose();
      // Reset form after submission
      setTitle("");
      setAuthor("");
      setGenre("");
      setDescription("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {initialData ? "Edit Book" : "Add New Book"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {loading ? "Saving..." : initialData ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;