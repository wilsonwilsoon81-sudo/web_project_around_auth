import { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import api from "../utils/api.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import Register from "./Register/Register.jsx";
import Login from "./Login/Login.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
    avatar: "",
    _id: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  function handleOpenPopup(popupData) {
    setPopup(popupData);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  useEffect(() => {
    if (!loggedIn) return;

    setIsLoading(true);

    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);

        if (Array.isArray(cardsData)) {
          setCards(cardsData);
        } else {
          console.warn("Las tarjetas no son un array:", cardsData);
          setCards([]);
        }
      })
      .catch((err) => {
        console.error("❌ Error al cargar datos iniciales:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [loggedIn]);

  function handleCardLike(card) {
    const isLiked = card.isLiked;
    api
      .toggleLike(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard,
          ),
        );
      })
      .catch((err) => console.error("Error al dar/quitar like:", err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id),
        );
      })
      .catch((err) => console.error("Error al eliminar tarjeta:", err));
  }

  function handleAddPlaceSubmit(cardData) {
    return api
      .addNewCard(cardData.name, cardData.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        handleClosePopup();
      })
      .catch((err) => console.error("Error al agregar tarjeta:", err));
  }

  function handleUpdateUser(data) {
    return api
      .updateUserInfo(data.name, data.about)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((err) => {
        console.error("❌ Error al actualizar el usuario:", err);
      });
  }

  function handleUpdateAvatar(data) {
    return api
      .updateUserAvatar(data.avatar)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((err) => {
        console.error("❌ Error al actualizar el avatar:", err);
      });
  }

  function handleRegister(email, password) {
    console.log("Registro:", email, password);
    // TODO: conectar con la API en el siguiente paso
  }

  // ─── Login (placeholder – se conecta en el siguiente paso) ────
  function handleLogin(email, password) {
    console.log("Login:", email, password);
    // TODO: conectar con la API en el siguiente paso
  }

  // ─── Logout (placeholder) ─────────────────────────────────
  function handleSignOut() {
    setLoggedIn(false);
    // TODO: eliminar JWT del localStorage en el siguiente paso
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        onUpdateAvatar: handleUpdateAvatar,
      }}
    >
      <BrowserRouter>
        <div className="page__content">
          <Header
            loggedIn={loggedIn}
            onSignOut={handleSignOut}
          />

          <Switch>
            {/* Ruta protegida: solo usuarios autorizados */}
            <ProtectedRoute
              exact
              path="/"
              component={Main}
              loggedIn={loggedIn}
              cards={cards}
              isLoading={isLoading}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              onAddPlace={handleAddPlaceSubmit}
              onOpenPopup={handleOpenPopup}
              onClosePopup={handleClosePopup}
              popup={popup}
            />

            {/* Ruta de registro: accesible sin login */}
            <Route path="/signup">
              <Register onRegister={handleRegister} />
            </Route>

            {/* Ruta de login: accesible sin login */}
            <Route path="/signin">
              <Login onLogin={handleLogin} />
            </Route>

            {/* Cualquier otra ruta → redirige a / */}
            <Redirect to="/" />
          </Switch>

          <Footer />
        </div>
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
}

export default App;
