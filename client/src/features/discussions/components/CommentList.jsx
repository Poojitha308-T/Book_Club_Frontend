import { useState } from "react";
import ReactQuill from "react-quill";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import { postComment } from "../discussions.api";
import { toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";

/* ----------- Build Comment Map ----------- */
const buildCommentMap = (comments) => {
  const map = {};
  comments.forEach((comment) => {
    const parent = comment.parent_id || null;
    if (!map[parent]) {
      map[parent] = [];
    }
    map[parent].push(comment);
  });
  return map;
};

/* ----------- Comment Item ----------- */
const CommentItem = ({
  comment,
  level,
  renderChildren,
  setComments,
}) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = async () => {
    if (!replyContent || replyContent === "<p><br></p>") {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      const newReply = await postComment({
        thread_id: comment.thread_id,
        parent_id: comment.id,
        content: replyContent,
      });

      // Add reply locally
      setComments((prev) => [...prev, newReply]);

      setReplyContent("");
      setReplyOpen(false);
      toast.success("Reply posted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post reply");
    }
  };

  return (
    <div
      className="flex flex-col space-y-3"
      style={{ marginLeft: `${level * 24}px` }} // FIXED Tailwind issue
    >
      <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">
          {comment.user_name} •{" "}
          {new Date(comment.created_at).toLocaleString()}
        </p>

        <div
          className="prose prose-sm max-w-full"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(comment.content),
          }}
        />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setReplyOpen(!replyOpen)}
          className="mt-2"
        >
          Reply
        </Button>
      </div>

      {/* Reply Editor */}
      {replyOpen && (
        <div className="space-y-2">
          <ReactQuill
            theme="snow"
            value={replyContent}
            onChange={setReplyContent}
            placeholder="Write your reply..."
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleReply}>
              Post Reply
            </Button>
          </div>
        </div>
      )}

      {renderChildren()}
    </div>
  );
};

/* ----------- Comment List ----------- */
const CommentList = ({ comments, setComments }) => {
  if (!comments || comments.length === 0) {
    return (
      <p className="text-gray-500">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  const commentMap = buildCommentMap(comments);

  const renderTree = (parentId = null, level = 0) => {
    return commentMap[parentId]?.map((comment) => (
      <CommentItem
        key={comment.id}
        comment={comment}
        level={level}
        setComments={setComments}
        renderChildren={() =>
          renderTree(comment.id, level + 1)
        }
      />
    ));
  };

  return <div className="space-y-6">{renderTree()}</div>;
};

export default CommentList;