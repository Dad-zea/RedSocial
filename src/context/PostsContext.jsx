import { createContext, useContext, useEffect, useState } from "react";

const PostsContext = createContext(null);
const STORAGE_KEY = "facebook-post-hooks-state";
const MAX_TEXT_LENGTH = 500;

export function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const formatDate = () =>
  new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date());

function readStoredPosts() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const SEED_POSTS = [
  {
    id: "seed-post-1",
    author: "Camila Restrepo",
    avatarColor: "#1877f2",
    time: "hace 2 h",
    text: "¡Terminé el ejercicio de Hooks en React! 🚀 Publicación, likes, comentarios y respuestas, todo con useState. 😄",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80&auto=format&fit=crop",
    likes: 12,
    liked: false,
    shares: 2,
    comments: [
      {
        id: "seed-comment-1",
        author: "Julián Gómez",
        avatarColor: "#e4405f",
        text: "¡Excelente trabajo! Quedó igualito a Facebook.",
        time: "hace 1 h",
        likes: 3,
        liked: false,
        replies: [
          {
            id: "seed-reply-1",
            author: "Camila Restrepo",
            avatarColor: "#1877f2",
            text: "¡Gracias, Julián! 🙌",
            time: "hace 50 min",
          },
        ],
      },
      {
        id: "seed-comment-2",
        author: "Andrea López",
        avatarColor: "#f77737",
        text: "¿Usaste useState para los comentarios anidados?",
        time: "hace 30 min",
        likes: 1,
        liked: false,
        replies: [],
      },
    ],
  },
];

function makeNewPost({ text, image }) {
  return {
    id: makeId(),
    author: "Tú",
    avatarColor: "#42b72a",
    time: "justo ahora",
    text,
    image: image || null,
    likes: 0,
    liked: false,
    shares: 0,
    comments: [],
  };
}

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(() => readStoredPosts() ?? SEED_POSTS);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // localStorage no disponible (modo privado, cuota, etc.): se pierde la persistencia sin romper la app
    }
  }, [posts]);

  function addPost({ text, image }) {
    const trimmed = text.trim();
    if (!trimmed && !image) {
      return { success: false, error: "Escribe algo o añade una foto antes de publicar." };
    }
    if (trimmed.length > MAX_TEXT_LENGTH) {
      return { success: false, error: `La publicación no puede superar ${MAX_TEXT_LENGTH} caracteres.` };
    }
    setPosts((prev) => [makeNewPost({ text: trimmed, image }), ...prev]);
    return { success: true };
  }

  function toggleLike(postId) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  }

  async function sharePost(postId) {
    const post = posts.find((p) => p.id === postId);
    if (!post) return { success: false, error: "No se encontró la publicación." };

    try {
      if (navigator.share) {
        await navigator.share({ title: "Publicación", text: post.text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(post.text);
      }
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, shares: p.shares + 1 } : p)));
      return { success: true, usedClipboard: !navigator.share };
    } catch (err) {
      if (err?.name === "AbortError") return { success: false, aborted: true };
      return { success: false, error: "No se pudo compartir la publicación." };
    }
  }

  function addComment(postId, text) {
    const trimmed = text.trim();
    if (!trimmed) return { success: false, error: "Escribe un comentario antes de enviarlo." };
    if (trimmed.length > MAX_TEXT_LENGTH) {
      return { success: false, error: `El comentario no puede superar ${MAX_TEXT_LENGTH} caracteres.` };
    }
    const newComment = {
      id: makeId(),
      author: "Tú",
      avatarColor: "#42b72a",
      text: trimmed,
      time: formatDate(),
      likes: 0,
      liked: false,
      replies: [],
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
    return { success: true };
  }

  function addReply(postId, commentId, text) {
    const trimmed = text.trim();
    if (!trimmed) return { success: false, error: "Escribe una respuesta antes de enviarla." };
    if (trimmed.length > MAX_TEXT_LENGTH) {
      return { success: false, error: `La respuesta no puede superar ${MAX_TEXT_LENGTH} caracteres.` };
    }
    const newReply = {
      id: makeId(),
      author: "Tú",
      avatarColor: "#42b72a",
      text: trimmed,
      time: formatDate(),
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== postId
          ? p
          : {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
              ),
            }
      )
    );
    return { success: true };
  }

  function toggleCommentLike(postId, commentId) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== postId
          ? p
          : {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId
                  ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
                  : c
              ),
            }
      )
    );
  }

  return (
    <PostsContext.Provider
      value={{ posts, addPost, toggleLike, sharePost, addComment, addReply, toggleCommentLike }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts debe usarse dentro de PostsProvider");
  return ctx;
}
