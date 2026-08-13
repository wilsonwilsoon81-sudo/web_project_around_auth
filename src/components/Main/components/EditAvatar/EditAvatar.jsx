import { useRef, useContext, useState } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext.js";

export default function EditAvatar({ isOpen, onClose, onUpdateAvatar }) {
  
  const currentUser = useContext(CurrentUserContext) || {};
  const avatarRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    if (onUpdateAvatar) {
      onUpdateAvatar({ avatar: avatarRef.current.value })
        .then(() => onClose())
        .catch((err) => console.error("Error al actualizar avatar:", err))
        .finally(() => setIsSubmitting(false));
    }
  }

  return (
    <div className="popup popup_is-opened">
      <div className="popup__content">
        <button 
          type="button" 
          className="popup__close" 
          onClick={onClose}
          aria-label="Cerrar"
        ></button>
        <h3 className="popup__title">Actualizar avatar</h3>
        
        <form className="popup__form" name="avatar-form" onSubmit={handleSubmit} noValidate>
          <label className="popup__label">
            <input
              ref={avatarRef}
              className="popup__input popup__input_type_avatar"
              name="avatar"
              placeholder="Enlace de la imagen"
              required
              type="url"
              defaultValue={currentUser.avatar}
            />
            <span className="popup__input-error"></span>
          </label>

          <button 
            type="submit" 
            className="button popup__button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}
