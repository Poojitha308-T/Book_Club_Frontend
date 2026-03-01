import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getComments, addComment } from "../discussions.api";
import CommentList from "../components/CommentList";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DiscussionDetailsPage = () => {
  const { threadId } = useParams();
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getComments({ threadId });
      setComments(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (threadId) fetchComments();
  }, [threadId]);

  const handleComment = async () => {
    if (!commentContent || commentContent === "<p><br></p>")
      return toast.error("Comment cannot be empty");
    try {
      const newComment = await addComment({ threadId, content: commentContent });
      setComments((prev) => [...prev, newComment]);
      setCommentContent("");
      toast.success("Comment posted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post comment");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading comments...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-md space-y-4">
        <ReactQuill
          theme="snow"
          value={commentContent}
          onChange={setCommentContent}
          placeholder="Write a comment..."
        />
        <div className="flex justify-end">
          <Button onClick={handleComment}>Post Comment</Button>
        </div>
      </div>

      <CommentList comments={comments} setComments={setComments} />
    </div>
  );
};

export default DiscussionDetailsPage;