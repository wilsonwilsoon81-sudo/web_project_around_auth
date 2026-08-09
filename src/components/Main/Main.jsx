import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";
import Card from "./components/Card/Card.jsx";

export default function Main({
  cards,
  onCardLike,
  onCardDelete,
  onEditProfile,
  onAddCard,
  onEditAvatar,
  onCardClick,
}) {
  
  const currentUser = useContext(CurrentUserContext) || { name: "", about: "", avatar: "" };

  return (
    <main className="content">
      <section className="profile page__section">
        <div className="profile__image-container" id="avatar-container">
          <img
            className="profile__image"
            src={
              currentUser?.avatar ||
              "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/default-avatar.jpg"
            }
            alt={`Avatar de ${currentUser?.name || "Usuario"}`}
          />
          <button
            type="button"
            className="profile__edit-avatar"
            aria-label="Editar avatar"
            id="edit-avatar-button"
            onClick={onEditAvatar}
          ></button>
        </div>

        <div className="profile__info">
          <h1 className="profile__title">
            {currentUser?.name || "Cargando..."}
          </h1>
          <button
            aria-label="Editar perfil"
            className="profile__edit-button"
            type="button"
            onClick={onEditProfile}
          ></button>
          <p className="profile__description">
            {currentUser?.about || "Cargando..."}
          </p>
        </div>

        <button
          aria-label="Agregar tarjeta"
          className="profile__add-button"
          type="button"
          onClick={onAddCard}
        ></button>
      </section>

      <section className="cards page__section">
        <ul className="cards__list">
          {Array.isArray(cards) &&
            cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete}
              />
            ))}
        </ul>
      </section>

      {}
    </main>
  );
}
