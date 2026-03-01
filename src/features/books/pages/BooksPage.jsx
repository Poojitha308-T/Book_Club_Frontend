// src/features/books/pages/BooksPage.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trash2, Pencil, Plus } from "lucide-react";

import { getAllBooks, createBook, updateBook, deleteBook } from "../books.api";
import { addBookToLibrary } from "@/features/library/library.api";
import BookCard from "../components/BookCard";
import BookFormModal from "../components/BookFormModal";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({ title: "", author: "", genre: "" });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getAllBooks();
      setBooks(res.books || []);
    } catch {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      toast.success("Book deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({ title: book.title, author: book.author, genre: book.genre || "" });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBook(null);
    setFormData({ title: "", author: "", genre: "" });
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingBook) {
        const res = await updateBook(editingBook.id, data);
        setBooks((prev) => prev.map((b) => (b.id === editingBook.id ? res.book : b)));
        toast.success("Book updated successfully");
      } else {
        const res = await createBook(data);
        setBooks((prev) => [res.book, ...prev]);
        toast.success("Book created successfully");
      }
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleAddToLibrary = async (bookId) => {
    try {
      await addBookToLibrary(bookId);
      toast.success("Book added to library!");
    } catch {
      toast.error("Failed to add book to library");
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-indigo-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Books Management</h1>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={18} /> Add Book
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddToLibrary={handleAddToLibrary}
              />
            ))}
          </div>
        )}

        {modalOpen && (
          <BookFormModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSuccess={handleSubmit}
            formData={formData}
          />
        )}
      </div>
    </div>
  );
};

export default BooksPage;