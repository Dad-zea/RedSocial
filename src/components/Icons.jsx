export function LikeIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M7 22V11m0 11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3m3 11h8.5a2 2 0 0 0 2-1.6l1.2-6A2 2 0 0 0 19.7 12H14l1-4.5A1.5 1.5 0 0 0 13.5 6L10 11.5V22Z" strokeLinejoin="round" />
    </svg>
  );
}

export function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1 4.6A7.96 7.96 0 0 1 21 12Z" strokeLinejoin="round" />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
