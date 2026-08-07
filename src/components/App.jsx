import { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import api from "../utils/api.js";
import auth from "../utils/auth.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import Register from "./Register/Register.jsx";
import Login from "./Login/Login.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
    avatar: "",
    _id: "",
  });

  const initialLoggedIn = !!localStorage.getItem("jwt");
  const [isLoading, setIsLoading] = useState(initialLoggedIn);
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);
  const [loggedIn, setLoggedIn] = useState(initialLoggedIn);
  const [userEmail, setUserEmail] = useState("");

  const [infoTooltip, setInfoTooltip] = useState({
    isOpen: false,
    title: "",
    isSuccess: false,
    message: "",
  });

  function handleOpenPopup(popupData) {
    setPopup(popupData);
  }

  function handleClosePopup() {
    setPopup(null);
    setInfoTooltip((prev) => ({ ...prev, isOpen: false }));
  }

  // ─── CARGA INICIAL DE DATOS ───────────────────────────────
  useEffect(() => {
    if (!loggedIn) return;

    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) setIsLoading(true);

      // 1. OBTENER Y LIMPIAR EL TOKEN DEL LOCALSTORAGE
      const token = localStorage.getItem("jwt")?.trim();

      if (!token) {
        setLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        // 2. PASAR EL TOKEN A LAS FUNCIONES DE API
        const [userDataResponse, cardsData] = await Promise.all([
          api.getUserInfo(token),
          api.getInitialCards(token)
        ]);

        if (isMounted) {
          // 3. MANEJAR LA ESTRUCTURA { data: { email, _id } } DEL SERVIDOR
          const user = userDataResponse.data || userDataResponse;
          
          setCurrentUser(user);
          setUserEmail(user.email || "");
          setCards(Array.isArray(cardsData) ? cardsData : []);
        }
      } catch (err) {
        console.error("❌ Error al cargar datos (Token inválido):", err);
        if (isMounted) {
          localStorage.removeItem("jwt");
          setLoggedIn(false);
          setUserEmail("");
          setIsLoading(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [loggedIn]);

  // ─── FUNCIONES DE TARJETAS Y USUARIO (TODAS RECIBEN EL TOKEN) ──
  function handleCardLike(card) {
    const token = localStorage.getItem("jwt")?.trim();
    const isLiked = card.isLiked;
    api.toggleLike(card._id, !isLiked, token)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => c._id === card._id ? newCard : c)
        );
      })
      .catch((err) => console.error("Error al dar/quitar like:", err));
  }

  function handleCardDelete(card) {
    const token = localStorage.getItem("jwt")?.trim();
    api.deleteCard(card._id, token)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.error("Error al eliminar tarjeta:", err));
  }

  function handleAddPlaceSubmit(cardData) {
    const token = localStorage.getItem("jwt")?.trim();
    return api.addNewCard(cardData.name, cardData.link, token)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        handleClosePopup();
      })
      .catch((err) => console.error("Error al agregar tarjeta:", err));
  }

  function handleUpdateUser(data) {
    const token = localStorage.getItem("jwt")?.trim();
    return api.updateUserInfo(data.name, data.about, token)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((err) => console.error("Error al actualizar usuario:", err));
  }

  function handleUpdateAvatar(data) {
    const token = localStorage.getItem("jwt")?.trim();
    return api.updateUserAvatar(data.avatar, token)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((err) => console.error("Error al actualizar avatar:", err));
  }

  // ─── AUTENTICACIÓN ────────────────────────────────────────
  function handleRegister(email, password) {
    auth.register(email, password)
      .then(() => {
        setInfoTooltip({
          isOpen: true,
          title: "¡Éxito!",
          message: "Te has registrado correctamente.",
          isSuccess: true,
        });
        setTimeout(() => {
          window.location.replace("/signin");
        }, 3000);
      })
      .catch((err) => {
        console.error("Error en el registro:", err);
        setInfoTooltip({
          isOpen: true,
          title: "Algo salió mal",
          message: "No se ha podido registrar. Inténtalo de nuevo.",
          isSuccess: false,
        });
      });
  }

  function handleLogin(email, password) {
    auth.login(email, password)
      .then((data) => {
        // El servidor devuelve { token: "..." } o { data: { token: "..." } }
        const token = data.token || (data.data && data.data.token);
        
        if (token) {
          localStorage.setItem("jwt", token.trim());
          setUserEmail(email);
          setLoggedIn(true);
          window.location.replace("/");
        }
      })
      .catch((err) => {
        console.error("Error en el login:", err);
        setInfoTooltip({
          isOpen: true,
          title: "Algo salió mal",
          message: "Email o contraseña incorrectos.",
          isSuccess: false,
        });
      });
  }

  function handleSignOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setUserEmail("");
    setIsLoading(false);
    window.location.replace("/signin");
  }

  // ─── RENDERIZADO ──────────────────────────────────────────
  return (
    <CurrentUserContext.Provider
      value={{ currentUser, handleUpdateUser, onUpdateAvatar: handleUpdateAvatar }}
    >
      <BrowserRouter>
        <div className="page__content">
          <Header loggedIn={loggedIn} onSignOut={handleSignOut} email={userEmail} />

          <Switch>
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
            <Route path="/signup">
              <Register onRegister={handleRegister} />
            </Route>
            <Route path="/signin">
              <Login onLogin={handleLogin} />
            </Route>
            <Redirect to="/" />
          </Switch>

          <Footer />

          <InfoTooltip
            isOpen={infoTooltip.isOpen}
            onClose={handleClosePopup}
            title={infoTooltip.title}
            message={infoTooltip.message}
            isSuccess={infoTooltip.isSuccess}
          />
        </div>
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
}

export default App;
