import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getThreadById, postComment } from "../discussions.api";
import CommentList from "../components/CommentList";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";

const DiscussionDetailsPage = () => {
  const { id } = useParams();

  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");

  const fetchThread = async () => {
    try {
      setLoading(true);
      const data = await getThreadById(id);

      // Expecting backend to return:
      // { thread: {...}, comments: [...] }
      setThread(data.thread);
      setComments(data.comments || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch thread");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  const handleComment = async () => {
    if (!commentContent || commentContent === "<p><br></p>") {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const newComment = await postComment({
        thread_id: id,
        content: commentContent,
      });

      // Add comment locally instead of refetching everything
      setComments((prev) => [...prev, newComment]);

      setCommentContent("");
      toast.success("Comment posted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment");
    }
  };

  if (loading)
    return <p className="text-gray-500 p-6">Loading thread...</p>;

  if (!thread)
    return <p className="text-gray-500 p-6">Thread not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Thread Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          {thread.title}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {comments.length} comments
        </p>
      </div>

      {/* Add New Comment */}
      <div className="bg-white p-4 rounded-2xl shadow-md space-y-2">
        <ReactQuill
          theme="snow"
          value={commentContent}
          onChange={setCommentContent}
          placeholder="Write your comment..."
        />
        <div className="flex justify-end">
          <Button onClick={handleComment}>Post Comment</Button>
        </div>
      </div>

      {/* Comments */}
      <CommentList
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
};

export default DiscussionDetailsPage;