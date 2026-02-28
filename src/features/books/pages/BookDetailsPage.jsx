import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../books.api";
import { toast } from "react-toastify";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBook = async () => {
    try {
      const res = await getBookById(id);
      setBook(res.data);
    } catch (error) {
      toast.error("Failed to fetch book details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10">Loading...</p>;

  if (!book)
    return <p className="text-center mt-10">Book not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <img
        src={book.cover_image}
        alt={book.title}
        className="h-80 w-full object-cover rounded-lg"
      />

      <h1 className="text-3xl font-bold mt-6">
        {book.title}
      </h1>

      <p className="text-gray-600 mt-2">
        by {book.author}
      </p>

      <p className="mt-4 text-gray-700">
        {book.description}
      </p>
    </div>
  );
};

export default BookDetailsPage;