import { useState, useContext } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext.js";

export default function EditProfile({ isOpen, onClose, onUpdateUser }) {
  
  const currentUser = useContext(CurrentUserContext) || {};
  const [name, setName] = useState(currentUser?.name || "");
  const [description, setDescription] = useState(currentUser?.about || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    if (onUpdateUser) {
      onUpdateUser({ name, about: description })
        .then(() => onClose())
        .catch((err) => console.error("Error al actualizar perfil:", err))
        .finally(() => setIsSubmitting(false));
    }
  }

  return (
    <div className="popup popup_is-opened">
      <div className="popup__content">
        <button type="button" className="popup__close" onClick={onClose} aria-label="Cerrar"></button>
        <h3 className="popup__title">Editar perfil</h3>
        
        <form className="popup__form" name="profile-form" onSubmit={handleSubmit} noValidate>
          <label className="popup__label">
            <input
              className="popup__input popup__input_type_name"
              name="name"
              placeholder="Nombre"
              required
              minLength="2"
              maxLength="40"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="popup__label">
            <input
              className="popup__input popup__input_type_description"
              name="about"
              placeholder="Acerca de mí"
              required
              minLength="2"
              maxLength="200"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <button 
            type="submit" 
            className={`button popup__button ${!name || !description ? 'popup__button_disabled' : ''}`}
            disabled={isSubmitting || !name || !description}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}
