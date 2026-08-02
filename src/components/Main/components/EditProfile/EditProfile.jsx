import { useState, useContext } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext.js";

export default function EditProfile() {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);

  const [name, setName] = useState(currentUser.name);
  const [description, setDescription] = useState(currentUser.about);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateName(value) {
    if (!value || value.trim() === "") {
      return "El nombre es obligatorio";
    }
    if (value.length < 2) {
      return "El nombre debe tener al menos 2 caracteres";
    }
    if (value.length > 40) {
      return "El nombre no puede tener más de 40 caracteres";
    }
    return "";
  }

  function validateDescription(value) {
    if (!value || value.trim() === "") {
      return "La descripción es obligatoria";
    }
    if (value.length < 2) {
      return "La descripción debe tener al menos 2 caracteres";
    }
    if (value.length > 200) {
      return "La descripción no puede tener más de 200 caracteres";
    }
    return "";
  }

  function handleNameChange(e) {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value));
  }

  function handleDescriptionChange(e) {
    const value = e.target.value;
    setDescription(value);
    setDescriptionError(validateDescription(value));
  }

  const isValid = !nameError && !descriptionError && name && description;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    handleUpdateUser({ name, about: description }).finally(() => {
      setIsSubmitting(false);
    });
  }

  return (
    <form
      className="popup__form"
      name="profile-form"
      id="edit-profile-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__label">
        <input
          className={`popup__input popup__input_type_name ${
            nameError ? "popup__input_type_invalid" : ""
          }`}
          id="owner-name"
          maxLength="40"
          minLength="2"
          name="userName"
          placeholder="Nombre"
          required
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        <span
          className={`popup__input-error ${
            nameError ? "popup__input-error_active" : ""
          }`}
          id="owner-name-error"
        >
          {nameError}
        </span>
      </label>

      <label className="popup__label">
        <input
          className={`popup__input popup__input_type_description ${
            descriptionError ? "popup__input_type_invalid" : ""
          }`}
          id="owner-description"
          maxLength="200"
          minLength="2"
          name="userDescription"
          placeholder="Acerca de mí"
          required
          type="text"
          value={description}
          onChange={handleDescriptionChange}
        />
        <span
          className={`popup__input-error ${
            descriptionError ? "popup__input-error_active" : ""
          }`}
          id="owner-description-error"
        >
          {descriptionError}
        </span>
      </label>

      <button
        className={`button popup__button ${
          !isValid ? "popup__button_disabled" : ""
        }`}
        type="submit"
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
