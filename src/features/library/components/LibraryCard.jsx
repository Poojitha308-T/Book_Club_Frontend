// src/features/library/components/LibraryCard.jsx
import React from "react";

const LibraryCard = ({ book, onRemove, onUpdateStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
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
        <span className="inline-block mt-2 px-3 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full capitalize">
          {book.status}
        </span>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          {onUpdateStatus && (
            <select
              value={book.status}
              onChange={(e) => onUpdateStatus(book.book_id, e.target.value)}
              className="px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
              <option value="to_read">To Read</option>
            </select>
          )}
        </div>
        {onRemove && (
          <button
            onClick={() => onRemove(book.book_id)}
            className="text-red-600 hover:scale-110 transition text-sm"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default LibraryCard;