import { useState } from "react";
import { createBook } from "../books.api";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

const BookFormModal = ({ onBookCreated }) => {
  const { user } = useAuth(); // safe because BooksPage already ensures user exists
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    coverUrl: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.author) {
      toast.error("Title and Author are required");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, addedBy: user?.email };
      const newBook = await createBook(payload);
      toast.success("Book added successfully!");
      onBookCreated(newBook); // refresh BooksPage
      setFormData({ title: "", author: "", description: "", coverUrl: "" });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add New Book</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Fill in the book details below and save to add it to the library.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            placeholder="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            placeholder="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          <Textarea
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <Input
            placeholder="Cover Image URL"
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleChange}
          />
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookFormModal;