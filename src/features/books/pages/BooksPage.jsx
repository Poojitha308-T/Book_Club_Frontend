// src/features/books/BooksPage.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, ArrowLeft } from "lucide-react";
import { getAllBooks, createBook, updateBook, deleteBook } from "../books.api";
import { addBookToLibrary } from "@/features/library/library.api";
import BookCard from "../components/BookCard";
import BookFormModal from "../components/BookFormModal";
import { useNavigate } from "react-router-dom";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    image_url: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getAllBooks();
      setBooks(res.books || []); // Backend returns 'books'
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
      await fetchBooks();
      toast.success("Book deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre || "",
      description: book.description || "",
      image_url: book.image_url || "",
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      genre: "",
      description: "",
      image_url: "",
    });
    setModalOpen(true);
  };

  // ✅ Updated handleSubmit for proper frontend reflection
  const handleSubmit = async (data) => {
    try {
      if (editingBook) {
        const updatedBook = await updateBook(editingBook.id, data);

        // ✅ Update local state so the changes reflect immediately
        setBooks((prevBooks) =>
          prevBooks.map((b) =>
            b.id === editingBook.id ? { ...b, ...updatedBook.book } : b
          )
        );

        toast.success("Book updated successfully");
      } else {
        const newBook = await createBook(data);
        setBooks((prevBooks) => [...prevBooks, newBook.book]); // Add new book to state
        toast.success("Book created successfully");
      }

      setModalOpen(false);
      setEditingBook(null);
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-1"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
              Books Management
            </h1>
          </div>

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
              <div
                key={i}
                className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            isEdit={!!editingBook}
          />
        )}
      </div>
    </div>
  );
};

export default BooksPage;