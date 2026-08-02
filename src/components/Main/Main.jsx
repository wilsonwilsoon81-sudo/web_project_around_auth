import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";
import ImagePopup from "../ImagePopup/ImagePopup.jsx";
import Popup from "./components/Popup/Popup.jsx";
import NewCard from "./components/NewCard/NewCard.jsx";
import EditProfile from "./components/EditProfile/EditProfile.jsx";
import EditAvatar from "./components/EditAvatar/EditAvatar.jsx";
import Card from "./components/Card/Card.jsx";

export default function Main({
  cards,
  isLoading,
  onCardLike,
  onCardDelete,
  onAddPlace,
  onOpenPopup,
  onClosePopup,
  popup,
}) {
  const { currentUser } = useContext(CurrentUserContext);
  const newCardPopup = {
    title: "Nuevo lugar",
    children: <NewCard onAddPlace={onAddPlace} />,
  };

  const editProfilePopup = {
    title: "Editar perfil",
    children: <EditProfile />,
  };

  const editAvatarPopup = {
    title: "Cambiar foto de perfil",
    children: <EditAvatar />,
  };

  return (
    <main className="content">
      <section className="profile page__section">
        <div className="profile__image-container" id="avatar-container">
          <img
            className="profile__image"
            src={
              currentUser.avatar ||
              "https://via.placeholder.com/120x120?text=Cargando..."
            }
            alt={`Avatar de ${currentUser.name || "Usuario"}`}
          />
          <button
            type="button"
            className="profile__edit-avatar"
            aria-label="Editar avatar"
            id="edit-avatar-button"
            onClick={() => onOpenPopup(editAvatarPopup)}
            disabled={isLoading}
          ></button>
        </div>

        <div className="profile__info">
          <h1 className="profile__title">
            {currentUser.name || "Cargando..."}
          </h1>
          <button
            aria-label="Editar perfil"
            className="profile__edit-button"
            type="button"
            onClick={() => onOpenPopup(editProfilePopup)}
            disabled={isLoading}
          ></button>
          <p className="profile__description">
            {currentUser.about || "Cargando..."}
          </p>
        </div>

        <button
          aria-label="Agregar tarjeta"
          className="profile__add-button"
          type="button"
          onClick={() => onOpenPopup(newCardPopup)}
          disabled={isLoading}
        ></button>
      </section>

      <section className="cards page__section">
        <ul className="cards__list">
          {Array.isArray(cards) &&
            cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                onOpenPopup={onOpenPopup}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete}
              />
            ))}
        </ul>
      </section>

      {popup && (
        <Popup onClose={onClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}
