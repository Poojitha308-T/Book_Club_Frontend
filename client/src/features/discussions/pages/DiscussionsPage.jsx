// src/features/discussions/pages/DiscussionsPage.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getThreads, createThread } from "../discussions.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useNavigate } from "react-router-dom";

const DiscussionsPage = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: "" });
  const navigate = useNavigate();

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const data = await getThreads();
      setThreads(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch threads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const handleCreateThread = async () => {
    if (!newThread.title) {
      toast.error("Thread title is required");
      return;
    }
    try {
      await createThread(newThread);
      toast.success("Thread created successfully");
      setNewThread({ title: "" });
      setModalOpen(false);
      fetchThreads();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create thread");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Discussions</h2>
        <Button onClick={() => setModalOpen(true)}>Create Thread</Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading threads...</p>
      ) : threads.length === 0 ? (
        <p className="text-gray-500">No threads yet. Start one!</p>
      ) : (
        <div className="space-y-4">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className="bg-white p-4 rounded-2xl shadow-md flex justify-between items-center hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/discussions/${thread.id}`)}
            >
              <div>
                <h3 className="font-semibold text-lg">{thread.title}</h3>
                <p className="text-sm text-gray-400">
                  {thread.comments_count || 0} comments • {thread.created_by_name}
                </p>
              </div>
              <span className="text-gray-500">→</span>
            </div>
          ))}
        </div>
      )}

      {/* Modal for creating thread */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Create New Thread</h3>
          <Input
            placeholder="Thread Title"
            value={newThread.title}
            onChange={(e) => setNewThread({ title: e.target.value })}
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