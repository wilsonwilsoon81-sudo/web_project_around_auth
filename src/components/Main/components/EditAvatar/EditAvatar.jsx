import { useRef, useContext, useState } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext.js";

export default function EditAvatar({ isOpen, onClose, onUpdateAvatar }) {
  
  const currentUser = useContext(CurrentUserContext) || {};
  const avatarInputRef = useRef();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarValue, setAvatarValue] = useState(currentUser?.avatar || "");

  function validateUrl(value) {
    if (!value || value.trim() === "") return "La URL es obligatoria";
    try {
      new URL(value);
      return "";
    } catch {
      return "Ingresa una URL válida";
    }
  }

  function handleAvatarChange(e) {
    const value = e.target.value;
    setAvatarValue(value);
    setAvatarError(validateUrl(value));
  }

  const isValid = !avatarError && avatarValue;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);

    if (onUpdateAvatar) {
      onUpdateAvatar({ avatar: avatarInputRef.current.value })
        .then(() => { if (onClose) onClose(); })
        .catch((err) => console.error("Error al actualizar avatar:", err))
        .finally(() => { setIsSubmitting(false); });
    } else {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="popup__form" name="avatar-form" id="edit-avatar-form" noValidate onSubmit={handleSubmit}>
      <label className="popup__label">
        <input
          className={`popup__input popup__input_type_avatar ${avatarError ? "popup__input_type_invalid" : ""}`}
          id="avatar-url"
          name="userAvatar"
          placeholder="URL de la imagen"
          required
          type="url"
          ref={avatarInputRef}
          defaultValue={currentUser?.avatar}
          onChange={handleAvatarChange}
        />
        <span className={`popup__input-error ${avatarError ? "popup__input-error_active" : ""}`} id="avatar-url-error">
          {avatarError}
        </span>
      </label>

      <button className={`button popup__button ${!isValid ? "popup__button_disabled" : ""}`} type="submit" disabled={isSubmitting || !isValid}>
        {isSubmitting ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
