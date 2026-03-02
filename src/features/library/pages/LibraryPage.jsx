import { useEffect, useState } from "react";
import { getUserLibrary, addBookToLibrary, removeBookFromLibrary } from "../library.api";
import { getAllBooks } from "@/features/books/books.api";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";

const LibraryPage = () => {
  const [library, setLibrary] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("to_read");
  const [loading, setLoading] = useState(true);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const libRes = await getUserLibrary();
        setLibrary(libRes.library ?? []);
        const allBooksRes = await getAllBooks();
        setBooks(allBooksRes.books ?? []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch library or books");
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  useEffect(() => {
    const libIds = library.map((b) => b.book_id);
    setFilteredBooks(books.filter((b) => !libIds.includes(b.id)));
  }, [books, library]);

  const handleAddToLibrary = async () => {
    if (!selectedBook) return toast.error("Select a book to add");

    try {
      const res = await addBookToLibrary(selectedBook, selectedStatus);
      if (res.success) {
        toast.success(res.message || "Book added to library");
        setSelectedBook("");
        setSelectedStatus("to_read");
        const libRes = await getUserLibrary();
        setLibrary(libRes.library ?? []);
      } else {
        toast.error(res.message || "Failed to add book");
      }
    } catch (err) {
      toast.error("Failed to add book");
      console.error(err);
    }
  };

  const handleRemoveFromLibrary = async (bookId) => {
    if (!bookId) return;

    try {
      const res = await removeBookFromLibrary(bookId);
      if (res.success) {
        toast.success("Book removed from library");
        const libRes = await getUserLibrary();
        setLibrary(libRes.library ?? []);
      } else {
        toast.error(res.message || "Failed to remove book");
      }
    } catch (err) {
      toast.error("Failed to remove book");
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading library...</div>;

  return (
    <div className="w-full px-6 py-8 max-w-7xl mx-auto">
      {/* Add Book Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Add a Book</h2>
        <Card className="border border-gray-200 shadow-md hover:shadow-lg transition">
          <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-center">
            <select
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
            >
              <option value="">Select a Book</option>
              {filteredBooks.map((b) => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="to_read">To Read</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={handleAddToLibrary}
              className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Add
            </button>
          </CardContent>
        </Card>
      </section>

      {/* Library List */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-5">My Library</h2>
        {library.length === 0 ? (
          <p className="text-gray-400">No books in your library yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {library.map((b) => (
              <Card
                key={b.book_id}
                className="border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition flex flex-col justify-between bg-white"
              >
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg text-gray-800">{b.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Status: <span className="font-medium text-gray-700">{b.status}</span></p>
                  {b.avgRating != null && (
                    <p className="text-sm mt-1 text-yellow-600 font-medium">
                      ⭐ {b.avgRating.toFixed(1)}
                    </p>
                  )}
                </CardContent>
                <button onClick={() => handleRemoveFromLibrary(b.book_id)} className="bg-red-500 text-white px-4 py-2 rounded-b-xl hover:bg-red-600 transition font-medium" > Remove </button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LibraryPage;