import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, Save, Image as ImageIcon } from "lucide-react";

const BookFormModal = ({ isOpen, onClose, onSuccess, formData: initialData, isEdit = false }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && isEdit) {
      setTitle(initialData.title || "");
      setAuthor(initialData.author || "");
      setGenre(initialData.genre || "");
      setDescription(initialData.description || "");
      setImageUrl(initialData.image_url || "");
    } else {
      setTitle(""); setAuthor(""); setGenre(""); setDescription(""); setImageUrl("");
    }
  }, [initialData, isEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return toast.error("Title and Author are required!");

    try {
      setLoading(true);
      await onSuccess({ title, author, genre, description, image_url: imageUrl });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all">
        <div className="flex items-center justify-between p-8 border-b dark:border-slate-800">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1">Catalogue Update</p>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              {isEdit ? "Refine Entry" : "New Collection"}
            </h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all dark:text-white"
                placeholder="The Great Gatsby"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all dark:text-white"
                placeholder="F. Scott Fitzgerald"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all dark:text-white"
                placeholder="Fiction"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Cover Image URL</label>
              <div className="relative">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all dark:text-white"
                  placeholder="https://..."
                />
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Synopsis</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold min-h-[120px] focus:ring-2 focus:ring-indigo-600 transition-all dark:text-white"
              placeholder="Describe this masterpiece..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-200 transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? "Archiving..." : isEdit ? "Update Archive" : "Commit to Library"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;