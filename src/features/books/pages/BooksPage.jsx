import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, ArrowLeft, Loader2 } from "lucide-react";
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
      // Ensure we are setting an array
      setBooks(res.books || res.data || []);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(bookId);
      // Optimistically remove from UI
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      toast.success("Book deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete book");
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

  const handleSubmit = async (data) => {
    try {
      if (editingBook) {
        // 1. Perform the update
        await updateBook(editingBook.id, data);
        
        // 2. Refetch ALL books from server to ensure UI matches DB
        // This fixes the "not reflecting" issue
        await fetchBooks();
        
        toast.success("Book updated successfully");
      } else {
        const res = await createBook(data);
        // Add new book to state
        setBooks((prevBooks) => [...prevBooks, res.book]);
        toast.success("Book created successfully");
      }
      setModalOpen(false);
      setEditingBook(null);
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleAddToLibrary = async (bookId) => {
    try {
      await addBookToLibrary(bookId);
      toast.success("Book added to library!");
    } catch (error) {
      console.error("Add to library failed:", error);
      toast.error("Failed to add book to library");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-10 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Books Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage your library collection
              </p>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Book
          </button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.length > 0 ? (
              books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddToLibrary={handleAddToLibrary}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 border border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-500">No books found. Add one to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
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