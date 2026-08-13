import { useState } from "react";

export default function NewCard({ isOpen, onClose, onAddPlace }) {
  
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    if (onAddPlace) {
      onAddPlace({ name, link })
        .then(() => onClose())
        .catch((err) => console.error("Error al crear tarjeta:", err))
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
        <h3 className="popup__title">Nuevo lugar</h3>
        
        <form className="popup__form" name="new-place-form" onSubmit={handleSubmit} noValidate>
          <label className="popup__label">
            <input
              className="popup__input popup__input_type_name"
              name="name"
              placeholder="Nombre del lugar"
              required
              minLength="2"
              maxLength="30"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="popup__input-error"></span>
          </label>

          <label className="popup__label">
            <input
              className="popup__input popup__input_type_url"
              name="link"
              placeholder="Enlace a la imagen"
              required
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <span className="popup__input-error"></span>
          </label>

          <button 
            type="submit" 
            className={`button popup__button ${!name || !link ? 'popup__button_disabled' : ''}`}
            disabled={isSubmitting || !name || !link}
          >
            {isSubmitting ? "Creando..." : "Crear"}
          </button>
        </form>
      </div>
    </div>
  );
}
