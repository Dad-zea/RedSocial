import { useState } from "react";
import Avatar from "./Avatar";
import CommentItem from "./CommentItem";
import { LikeIcon, CommentIcon, ShareIcon } from "./Icons";
import { usePosts } from "../context/PostsContext";

export default function Post({ post }) {
  const { toggleLike, sharePost, addComment } = usePosts();
  const [showComments, setShowComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentFeedback, setCommentFeedback] = useState("");
  const [shareFeedback, setShareFeedback] = useState("");

  async function handleShare() {
    const result = await sharePost(post.id);
    if (result.success) {
      setShareFeedback(result.usedClipboard ? "Enlace copiado al portapapeles." : "¡Publicación compartida!");
    } else if (!result.aborted) {
      setShareFeedback(result.error ?? "No se pudo compartir.");
    }
    if (result.success || !result.aborted) {
      setTimeout(() => setShareFeedback(""), 2500);
    }
  }

  function addCommentHandler(e) {
    e.preventDefault();
    const result = addComment(post.id, commentText);
    if (!result.success) {
      setCommentFeedback(result.error);
      return;
    }
    setCommentText("");
    setCommentFeedback("");
  }

  const commentCount = post.comments.reduce(
    (total, c) => total + 1 + (c.replies?.length ?? 0),
    0
  );

  return (
    <article className="post-card">
      <header className="post-header">
        <Avatar name={post.author} color={post.avatarColor} size={40} />
        <div>
          <p className="post-author">{post.author}</p>
          <p className="post-time">{post.time} · 🌐</p>
        </div>
      </header>

      <p className="post-text">{post.text}</p>

      {post.image && (
        <div className="post-image-wrap">
          <img className="post-image" src={post.image} alt="Publicación" />
        </div>
      )}

      <div className="post-stats">
        <span>
          {post.likes > 0 && (
            <>
              <span className="like-badge">👍</span> {post.likes}
            </>
          )}
        </span>
        <span>
          {commentCount > 0 && `${commentCount} comentarios`}
          {commentCount > 0 && post.shares > 0 && " · "}
          {post.shares > 0 && `${post.shares} veces compartido`}
        </span>
      </div>

      <div className="post-actions">
        <button
          className={`action-btn ${post.liked ? "active" : ""}`}
          onClick={() => toggleLike(post.id)}
        >
          <LikeIcon filled={post.liked} /> Me gusta
        </button>
        <button className="action-btn" onClick={() => setShowComments((v) => !v)}>
          <CommentIcon /> Comentar
        </button>
        <button className="action-btn" onClick={handleShare}>
          <ShareIcon /> Compartir
        </button>
      </div>

      {shareFeedback && <div className="share-feedback">{shareFeedback}</div>}

      {showComments && (
        <section className="comments-section">
          <form className="comment-form" onSubmit={addCommentHandler}>
            <Avatar name="Tú" color="#42b72a" size={32} />
            <input
              type="text"
              placeholder="Escribe un comentario..."
              maxLength={500}
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                setCommentFeedback("");
              }}
            />
            <button type="submit" disabled={!commentText.trim()}>
              Publicar
            </button>
          </form>
          {commentFeedback && <div className="form-feedback error">{commentFeedback}</div>}

          <div className="comments-list">
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} postId={post.id} comment={comment} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
