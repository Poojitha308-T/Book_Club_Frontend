import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
      <img
        src={book.cover_image}
        alt={book.title}
        className="h-48 w-full object-cover rounded-lg"
      />

      <h2 className="text-lg font-semibold mt-3">{book.title}</h2>

      <p className="text-gray-600">{book.author}</p>

      <Link
        to={`/books/${book.id}`}
        className="inline-block mt-3 text-blue-600 hover:underline"
      >
        View Details
      </Link>
      <button
        onClick={() => handleAddToLibrary(book.id)}
        className="mt-3 bg-indigo-600 text-white px-3 py-1 rounded"
      >
        Add to Library
      </button>
    </div>
  );
};

export default BookCard;
