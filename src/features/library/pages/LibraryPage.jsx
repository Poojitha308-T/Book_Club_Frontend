import { useEffect, useState } from "react";
import { getUserLibrary, addBookToLibrary, removeBookFromLibrary } from "../library.api";
import { getAllBooks } from "@/features/books/books.api";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";

const LibraryPage = () => {
  const [library, setLibrary] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("to_read"); // NEW
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

  // Add book to library with status
  const handleAddToLibrary = async () => {
    if (!selectedBook) return toast.error("Select a book to add");

    try {
      const res = await addBookToLibrary(selectedBook, selectedStatus); // pass status now
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

  if (loading) return <div className="p-10 text-center text-slate-500">Loading library...</div>;

  return (
    <div className="w-full overflow-x-hidden px-4 py-6 max-w-7xl mx-auto">
      {/* Add Book */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Add Book to Library</h2>
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
            <select
              className="flex-1 border p-2 rounded"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
            >
              <option value="">Select Book</option>
              {filteredBooks.map((b) => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>

            {/* Status dropdown */}
            <select
              className="border p-2 rounded"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="to_read">To Read</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={handleAddToLibrary}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add
            </button>
          </CardContent>
        </Card>
      </section>

      {/* Library List */}
      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-4">My Library</h2>
        {library.length === 0 ? (
          <p className="text-slate-400">No books in your library yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {library.map((b) => (
              <Card key={b.book_id} className="border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg">{b.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">Status: {b.status}</p>
                  {b.avgRating != null && (
                    <p className="text-sm mt-1">Avg Rating: {b.avgRating.toFixed(1)} ⭐</p>
                  )}
                </CardContent>
                <button
                  onClick={() => handleRemoveFromLibrary(b.book_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-b hover:bg-red-600"
                >
                  Remove
                </button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LibraryPage;