import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getThreadsByBook, createThread } from "../discussions.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import DiscussionCard from "../components/DiscussionCard";

const DiscussionsPage = ({ bookId }) => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const data = await getThreadsByBook({ bookId });
      setThreads(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch threads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) fetchThreads();
  }, [bookId]);

  const handleCreateThread = async () => {
    if (!newThreadTitle) return toast.error("Thread title required");
    try {
      await createThread({ bookId, title: newThreadTitle });
      toast.success("Thread created!");
      setNewThreadTitle("");
      setModalOpen(false);
      fetchThreads();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create thread");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Discussions</h2>
        <Button onClick={() => setModalOpen(true)}>New Thread</Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading threads...</p>
      ) : threads.length === 0 ? (
        <p className="text-gray-500">No threads yet.</p>
      ) : (
        <div className="space-y-4">
          {threads.map((thread) => (
            <DiscussionCard key={thread.id} thread={thread} />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Create New Thread</h3>
          <Input
            placeholder="Thread Title"
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleCreateThread}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DiscussionsPage;