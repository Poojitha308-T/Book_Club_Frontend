// src/features/books/components/BookCard.jsx
import React from "react";

const BookCard = ({ book, onAddToLibrary, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
      <div>
        {book.cover_image && (
          <img
            src={book.cover_image}
            alt={book.title}
            className="h-48 w-full object-cover rounded-lg mb-4"
          />
        )}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{book.title}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{book.author}</p>
        {book.genre && (
          <span className="inline-block mt-2 px-3 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full">
            {book.genre}
          </span>
        )}
      </div>

      <div className="flex justify-between mt-4 items-center">
        <div className="flex gap-2">
          {onEdit && (
            <button onClick={() => onEdit(book)} className="text-blue-600 hover:scale-110 transition">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(book.id)} className="text-red-600 hover:scale-110 transition">
              Delete
            </button>
          )}
        </div>

        {onAddToLibrary && (
          <button
            onClick={() => onAddToLibrary(book.id)}
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition text-sm"
          >
            Add to Library
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;