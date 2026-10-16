export default function Avatar({ name, color, size = 40 }) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? "?";
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.45,
      }}
    >
      {initial}
    </div>
  );
}
