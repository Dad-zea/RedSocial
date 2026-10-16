import { useState } from "react";
import Avatar from "./Avatar";
import { usePosts } from "../context/PostsContext";

export default function CommentItem({ postId, comment }) {
  const { toggleCommentLike, addReply } = usePosts();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyFeedback, setReplyFeedback] = useState("");

  function submitReply(e) {
    e.preventDefault();
    const result = addReply(postId, comment.id, replyText);
    if (!result.success) {
      setReplyFeedback(result.error);
      return;
    }
    setReplyText("");
    setReplyFeedback("");
    setShowReplyBox(false);
  }

  return (
    <div className="comment">
      <Avatar name={comment.author} color={comment.avatarColor} size={32} />
      <div className="comment-body">
        <div className="comment-bubble">
          <span className="comment-author">{comment.author}</span>
          <p className="comment-text">{comment.text}</p>
        </div>
        <div className="comment-meta">
          <span>{comment.time}</span>
          <button
            className={`link-btn ${comment.liked ? "active" : ""}`}
            onClick={() => toggleCommentLike(postId, comment.id)}
          >
            Me gusta{comment.likes > 0 ? ` (${comment.likes})` : ""}
          </button>
          <button className="link-btn" onClick={() => setShowReplyBox((v) => !v)}>
            Responder
          </button>
        </div>

        {showReplyBox && (
          <form className="reply-form" onSubmit={submitReply}>
            <input
              autoFocus
              type="text"
              maxLength={500}
              placeholder={`Responder a ${comment.author}...`}
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
                setReplyFeedback("");
              }}
            />
            <button type="submit" disabled={!replyText.trim()}>
              Enviar
            </button>
          </form>
        )}
        {replyFeedback && <div className="form-feedback error">{replyFeedback}</div>}

        {comment.replies?.length > 0 && (
          <div className="replies">
            {comment.replies.map((reply) => (
              <div className="comment reply" key={reply.id}>
                <Avatar name={reply.author} color={reply.avatarColor} size={28} />
                <div className="comment-body">
                  <div className="comment-bubble">
                    <span className="comment-author">{reply.author}</span>
                    <p className="comment-text">{reply.text}</p>
                  </div>
                  <div className="comment-meta">
                    <span>{reply.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
