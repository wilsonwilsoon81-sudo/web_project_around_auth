import { useState } from "react";

export default function NewCard({ onAddPlace }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [nameError, setNameError] = useState("");
  const [linkError, setLinkError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateName(value) {
    if (!value || value.trim() === "") {
      return "El nombre es obligatorio";
    }
    if (value.length < 2) {
      return "El nombre debe tener al menos 2 caracteres";
    }
    if (value.length > 30) {
      return "El nombre no puede tener más de 30 caracteres";
    }
    return "";
  }

  function validateLink(value) {
    if (!value || value.trim() === "") {
      return "La URL es obligatoria";
    }
    try {
      new URL(value);
      return "";
    } catch {
      return "Ingresa una URL válida";
    }
  }

  function handleNameChange(e) {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value));
  }

  function handleLinkChange(e) {
    const value = e.target.value;
    setLink(value);
    setLinkError(validateLink(value));
  }

  const isValid = !nameError && !linkError && name && link;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    onAddPlace({ name, link }).finally(() => {
      setIsSubmitting(false);
    });
  }

  return (
    <form
      className="popup__form"
      name="new-place-form"
      id="new-place-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__label">
        <input
          className={`popup__input popup__input_type_name ${
            nameError ? "popup__input_type_invalid" : ""
          }`}
          id="place-name"
          maxLength="30"
          minLength="2"
          name="name"
          placeholder="Nombre del lugar"
          required
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        <span
          className={`popup__input-error ${
            nameError ? "popup__input-error_active" : ""
          }`}
          id="place-name-error"
        >
          {nameError}
        </span>
      </label>

      <label className="popup__label">
        <input
          className={`popup__input popup__input_type_url ${
            linkError ? "popup__input_type_invalid" : ""
          }`}
          id="place-link"
          name="link"
          placeholder="Enlace a la imagen"
          required
          type="url"
          value={link}
          onChange={handleLinkChange}
        />
        <span
          className={`popup__input-error ${
            linkError ? "popup__input-error_active" : ""
          }`}
          id="place-link-error"
        >
          {linkError}
        </span>
      </label>

      <button
        className={`button popup__button ${
          !isValid ? "popup__button_disabled" : ""
        }`}
        type="submit"
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? "Creando..." : "Crear"}
      </button>
    </form>
  );
}
