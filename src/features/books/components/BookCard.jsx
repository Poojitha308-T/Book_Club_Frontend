import React from "react";
import { Edit2, Trash2, PlusCircle } from "lucide-react";

const BookCard = ({ book, onAddToLibrary, onEdit, onDelete }) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50">
      {/* Image Container */}
      <div className="w-full h-64 overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <img
          src={book.image_url || "/placeholder-book.png"}
          alt={book.title}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="space-y-2">
          {book.genre && (
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100">
              {book.genre}
            </span>
          )}
          <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">
            {book.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            by {book.author}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(book)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              title="Edit Book"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(book.id)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-white text-sm font-medium shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-950 dark:border-red-800 dark:bg-gray-950 dark:text-red-500 dark:hover:bg-red-900/20"
              title="Delete Book"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          {onAddToLibrary && (
            <button
              onClick={() => onAddToLibrary(book.id)}
              className="ml-auto inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-950 disabled:pointer-events-none disabled:opacity-50"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
