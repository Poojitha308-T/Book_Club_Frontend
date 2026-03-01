// src/features/books/components/BookFormModal.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const BookFormModal = ({ isOpen, onClose, onSuccess, formData: initialData, isEdit = false }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // ✅ New field for image URL
  const [loading, setLoading] = useState(false);

  // Initialize form with provided data (for editing)
  useEffect(() => {
    if (initialData && isEdit) {
      setTitle(initialData.title || "");
      setAuthor(initialData.author || "");
      setGenre(initialData.genre || "");
      setDescription(initialData.description || "");
      setImageUrl(initialData.image_url || ""); // ✅ populate image URL when editing
    } else {
      setTitle("");
      setAuthor("");
      setGenre("");
      setDescription("");
      setImageUrl("");
    }
  }, [initialData, isEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      toast.error("Title and Author are required!");
      return;
    }

    try {
      setLoading(true);
      // ✅ Include image_url in data sent to parent
      await onSuccess({ title, author, genre, description, image_url: imageUrl });
      toast.success(isEdit ? "Book updated successfully!" : "Book added successfully!");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          {isEdit ? "Edit Book" : "Add New Book"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-white transition"
          />

          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-white transition"
          />

          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-white transition"
          />

          <textarea
            placeholder="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-white transition resize-none"
          />

          {/* ✅ New input for image URL */}
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-white transition"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => !loading && onClose()}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center min-w-[110px]"
            >
              {loading ? "Saving..." : isEdit ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;