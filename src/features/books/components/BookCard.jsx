import React from "react";
import { Edit3, Trash2, PlusCircle, BookOpen, Star } from "lucide-react";

const BookCard = ({ book, onAddToLibrary, onEdit, onDelete }) => {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl p-3 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] border border-slate-100 dark:border-slate-800">
      
      {/* Visual Header: Full Image Visibility */}
      <div className="relative h-72 w-full mb-4 overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        {/* Blurred Background Placeholder for better aesthetics with contain */}
        <div 
          className="absolute inset-0 opacity-20 blur-2xl scale-110"
          style={{ 
            backgroundImage: `url(${book.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <img
          src={book.image_url || "https://via.placeholder.com/400x600?text=No+Cover"}
          alt={book.title}
          className="relative z-10 h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Genre Tag */}
        {book.genre && (
          <div className="absolute top-3 left-3 z-20">
            <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/20">
              {book.genre}
            </span>
          </div>
        )}

        {/* Action Overlay */}
        <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {onEdit && (
            <button
              onClick={() => onEdit(book)}
              className="p-3 bg-white rounded-xl text-slate-900 hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-110 shadow-xl"
            >
              <Edit3 size={18} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(book.id)}
              className="p-3 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 shadow-xl"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 px-2 pb-2">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-2 leading-tight tracking-tight">
            {book.title}
          </h3>
          <div className="flex items-center gap-1 text-amber-500 shrink-0 mt-0.5">
            <Star size={12} fill="currentColor" />
            <span className="text-[11px] font-bold">{book.average_rating || "4.5"}</span>
          </div>
        </div>
        
        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">
          {book.author}
        </p>

        {/* Footer Actions */}
        <div className="mt-auto flex items-center gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <BookOpen size={14} />
            View
          </button>
          
          {onAddToLibrary && (
            <button
              onClick={() => onAddToLibrary(book.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
            >
              <PlusCircle size={14} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;