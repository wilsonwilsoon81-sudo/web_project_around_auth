import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Main from './Main/Main';
import Footer from './Footer/Footer';
import ImagePopup from './ImagePopup/ImagePopup';
import EditProfile from './Main/components/EditProfile/EditProfile';
import NewCard from './Main/components/NewCard/NewCard';
import EditAvatar from './Main/components/EditAvatar/EditAvatar';
import Register from './Register/Register';
import Login from './Login/Login';
import InfoTooltip from './InfoTooltip/InfoTooltip';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import CurrentUserContext from '../contexts/CurrentUserContext';
import * as api from '../utils/api'; 

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  const [currentUser, setCurrentUser] = useState({ name: '', avatar: '', email: '' });
  const [cards, setCards] = useState([]);
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    console.log("🔍 1. Token encontrado en localStorage:", token);

    if (token) {
      api.getUserInfo(token)
        .then((res) => {
          console.log("✅ 2. Respuesta exitosa de /users/me:", res);
          setCurrentUser(res.data);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error("❌ ERROR REAL en /users/me (Token inválido):", err);
          localStorage.removeItem('jwt');
          setIsLoggedIn(false);
          setCurrentUser({ name: '', avatar: '', email: '' });
        });

      api.getInitialCards(token)
        .then((cardsData) => {
          console.log("✅ Tarjetas cargadas exitosamente:", cardsData);
          setCards(cardsData);
        })
        .catch((err) => {
          console.warn("⚠️ No se pudieron cargar las tarjetas (quizás el endpoint cambió o no hay tarjetas):", err);
          setCards([]);
        });
    }
  }, []);

  const handleRegister = ({ email, password }) => {
    api.register(email, password)
      .then(() => {
        setIsRegisterSuccess(true);
        setIsInfoTooltipOpen(true);
        navigate('/sign-in');
      })
      .catch((err) => {
        console.error('Error en registro:', err);
        setIsRegisterSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  const handleLogin = ({ email, password }) => {
    api.authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setIsLoggedIn(true);
          setCurrentUser((prev) => ({ ...prev, email: email }));
          navigate('/', { replace: true });
        }
      })
      .catch((err) => {
        console.error('Error en login:', err);
        setIsRegisterSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setCurrentUser({ name: '', avatar: '', email: '' });
    setCards([]);
    navigate('/sign-in', { replace: true });
  };

  const handleCardLike = (card) => {
    console.log("Dar like a:", card);
  };

  const handleCardDelete = (card) => {
    console.log("Eliminar tarjeta:", card);
  };

  const closeAllPopups = () => {
    setIsEditProfileOpen(false);
    setIsAddCardOpen(false);
    setIsEditAvatarOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  };

  return (
    <CurrentUserContext.Provider value={currentUser || { name: '', avatar: '', email: '' }}>
      <Header 
        loggedIn={isLoggedIn} 
        email={currentUser.email}
        onSignOut={handleSignOut}
      />
      
      <Routes>
        <Route path="/sign-up" element={<Register onRegister={handleRegister} />} />
        <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute 
              loggedIn={isLoggedIn}
              component={Main}
              cards={cards}
              onEditProfile={() => setIsEditProfileOpen(true)}
              onAddCard={() => setIsAddCardOpen(true)}
              onEditAvatar={() => setIsEditAvatarOpen(true)}
              onCardClick={setSelectedCard}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          } 
        />
      </Routes>

      
      {isLoggedIn && isEditProfileOpen && (
        <EditProfile onClose={closeAllPopups} />
      )}

      {isLoggedIn && isEditAvatarOpen && (
        <EditAvatar onClose={closeAllPopups} />
      )}

      {isLoggedIn && isAddCardOpen && (
        <NewCard onClose={closeAllPopups} />
      )}

      {isLoggedIn && selectedCard && (
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      )}

      <InfoTooltip 
        isOpen={isInfoTooltipOpen}
        onClose={closeAllPopups}
        isRegisterSuccess={isRegisterSuccess}
      />
      
      {location.pathname === '/' && <Footer />}

    </CurrentUserContext.Provider>
  );
}

export default App;
