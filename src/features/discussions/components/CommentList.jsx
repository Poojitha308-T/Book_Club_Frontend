import { useState } from "react";
import ReactQuill from "react-quill";
import { Button } from "@/components/ui/button";
import { addComment } from "../discussions.api";
import { toast } from "react-toastify";

const buildCommentMap = (comments) => {
  const map = {};
  comments.forEach((c) => {
    const parent = c.parent_id || null;
    if (!map[parent]) map[parent] = [];
    map[parent].push(c);
  });
  return map;
};

const CommentItem = ({ comment, level = 0, setComments, renderChildren }) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = async () => {
    if (!replyContent || replyContent === "<p><br></p>")
      return toast.error("Reply cannot be empty");
    try {
      const newReply = await addComment({
        threadId: comment.thread_id,
        content: replyContent,
        parentId: comment.id,
      });
      setComments((prev) => [...prev, newReply]);
      setReplyContent("");
      setReplyOpen(false);
      toast.success("Reply posted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post reply");
    }
  };

  return (
    <div style={{ marginLeft: level * 24 }} className="space-y-2">
      <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">
          {comment.user_name} • {new Date(comment.created_at).toLocaleString()}
        </p>
        <div dangerouslySetInnerHTML={{ __html: comment.content }} className="prose max-w-full" />
        <Button size="sm" variant="ghost" onClick={() => setReplyOpen(!replyOpen)} className="mt-2">
          Reply
        </Button>
      </div>

      {replyOpen && (
        <div className="space-y-2">
          <ReactQuill value={replyContent} onChange={setReplyContent} />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleReply}>Post Reply</Button>
          </div>
        </div>
      )}

      {renderChildren()}
    </div>
  );
};

const CommentList = ({ comments, setComments }) => {
  if (!comments || comments.length === 0) return <p className="text-gray-500">No comments yet.</p>;
  const map = buildCommentMap(comments);

  const renderTree = (parentId = null, level = 0) =>
    map[parentId]?.map((c) => (
      <CommentItem
        key={c.id}
        comment={c}
        level={level}
        setComments={setComments}
        renderChildren={() => renderTree(c.id, level + 1)}
      />
    ));

  return <div className="space-y-4">{renderTree()}</div>;
};

export default CommentList;