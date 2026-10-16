import { useRef, useState } from "react";
import Avatar from "./Avatar";
import { usePosts } from "../context/PostsContext";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export default function CreatePostBox() {
  const { addPost } = usePosts();
  const fileInputRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFeedbackType("error");
      setFeedback("Selecciona un archivo de imagen válido.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setFeedbackType("error");
      setFeedback("La imagen no puede superar 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setFeedback("");
    };
    reader.onerror = () => {
      setFeedbackType("error");
      setFeedback("No se pudo leer la imagen seleccionada.");
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = addPost({ text, image });
    if (!result.success) {
      setFeedbackType("error");
      setFeedback(result.error);
      return;
    }
    setText("");
    setImage("");
    setFeedbackType("success");
    setFeedback("¡Publicación creada!");
    setExpanded(false);
  }

  function handleCancel() {
    setText("");
    setImage("");
    setFeedback("");
    setExpanded(false);
  }

  const canSubmit = text.trim().length > 0 || Boolean(image);

  return (
    <div className="create-post">
      <div className="create-post-row">
        <Avatar name="Tú" color="#42b72a" size={40} />
        {expanded ? (
          <textarea
            autoFocus
            className="create-post-textarea"
            placeholder="¿Qué estás pensando?"
            maxLength={500}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setFeedback("");
            }}
          />
        ) : (
          <button type="button" className="create-post-trigger" onClick={() => setExpanded(true)}>
            ¿Qué estás pensando?
          </button>
        )}
      </div>

      {expanded && (
        <form className="create-post-form" onSubmit={handleSubmit}>
          {image && (
            <div className="create-post-preview">
              <img src={image} alt="Vista previa" />
              <button
                type="button"
                className="remove-image-btn"
                aria-label="Quitar imagen"
                onClick={() => setImage("")}
              >
                ✕
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="add-photo-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            📷 {image ? "Cambiar foto" : "Añadir foto"}
          </button>

          <div
            id="create-post-feedback"
            className={feedback ? `form-feedback ${feedbackType}` : "form-feedback"}
            role={feedbackType === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {feedback}
          </div>

          <div className="create-post-actions">
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={!canSubmit}>
              Publicar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
