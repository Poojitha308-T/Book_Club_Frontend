import { useEffect, useState } from "react";
import { getAllBooks, deleteBook, createBook, updateBook } from "../books.api";
import { toast } from "react-toastify";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addBookToLibrary } from "@/features/library/library.api";

const BooksPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Book deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const openAddModal = () => {
    setEditingBook(null);
    setFormData({ title: "", author: "", genre: "" });
    setModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({ title: book.title, author: book.author, genre: book.genre || "" });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingBook) {
        const res = await updateBook(editingBook.id, formData);
        setBooks((prev) => prev.map((b) => (b.id === editingBook.id ? res.book : b)));
        toast.success("Book updated successfully");
      } else {
        const res = await createBook(formData);
        setBooks((prev) => [res.book, ...prev]);
        toast.success("Book created successfully");
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const filteredBooks = books
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a[sortBy]?.localeCompare(b[sortBy]));

  const totalAuthors = new Set(books.map((b) => b.author)).size;
  const totalGenres = new Set(books.map((b) => b.genre)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-10 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Back Arrow */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Books Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage your book collection professionally
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Books" value={books.length} />
          <StatCard title="Authors" value={totalAuthors} />
          <StatCard title="Categories" value={totalGenres} />
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Search books..."
            className="px-4 py-3 rounded-xl border shadow-sm dark:bg-gray-800 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border shadow-sm dark:bg-gray-800 dark:text-white"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="genre">Sort by Genre</option>
          </select>
        </div>

        {/* Book Cards */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100 dark:border-gray-700 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{book.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">{book.author}</p>
                  <span className="inline-block mt-3 px-3 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full">
                    {book.genre}
                  </span>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button onClick={() => openEditModal(book)} className="text-blue-600 hover:scale-110 transition">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:scale-110 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        <button
          onClick={openAddModal}
          className="fixed bottom-10 right-10 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition"
        >
          <Plus />
        </button>

        {modalOpen && (
          <Modal editingBook={editingBook} formData={formData} setFormData={setFormData} onClose={() => setModalOpen(false)} onSave={handleSubmit} />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
    <p className="text-gray-500 dark:text-gray-400">{title}</p>
    <h2 className="text-2xl font-bold dark:text-white mt-2">{value}</h2>
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
    ))}
  </div>
);

const Modal = ({ editingBook, formData, setFormData, onClose, onSave }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-96 shadow-xl">
      <h2 className="text-xl font-bold mb-6 dark:text-white">{editingBook ? "Edit Book" : "Add Book"}</h2>
      <input placeholder="Title" className="w-full mb-4 px-4 py-2 border rounded" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
      <input placeholder="Author" className="w-full mb-4 px-4 py-2 border rounded" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
      <input placeholder="Genre" className="w-full mb-6 px-4 py-2 border rounded" value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} />
      <div className="flex justify-end gap-4">
        <button onClick={onClose}>Cancel</button>
        <button onClick={onSave} className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  </div>
);

const handleAddToLibrary = async (bookId) => {
  try {
    await addBookToLibrary(bookId);
    alert("Added to library!");
  } catch (error) {
    console.error(error);
  }
};

export default BooksPage;