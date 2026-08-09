import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Componentes
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

// Contextos y API
import CurrentUserContext from '../contexts/CurrentUserContext';
import * as api from '../utils/api'; 

function App() {
  const navigate = useNavigate();

  // Estados de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  // Estados de la aplicación
  const [currentUser, setCurrentUser] = useState({ name: '', avatar: '', email: '' });
  const [cards, setCards] = useState([]);
  
  // Estados de modales
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // 1. Verificar token al cargar la página
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      api.getUserInfo(token)
        .then((res) => {
          // ✅ CORRECCIÓN CLAVE: La API devuelve { data: { email, _id } }
          // Así que guardamos res.data en el estado
          setCurrentUser(res.data); 
          setIsLoggedIn(true);
          
          // Si el usuario es válido, cargamos sus tarjetas
          return api.getInitialCards(token);
        })
        .then((cardsData) => {
          setCards(cardsData);
        })
        .catch((err) => {
          console.warn('Token inválido o expirado. Limpiando sesión.', err);
          localStorage.removeItem('jwt');
          setIsLoggedIn(false);
          setCurrentUser({ name: '', avatar: '', email: '' });
        });
    }
  }, []);

  // 2. Manejar Registro
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

  // 3. Manejar Login
  const handleLogin = ({ email, password }) => {
    api.authorize(email, password)
      .then((data) => {
        // La API devuelve { token: "..." }
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setIsLoggedIn(true);
          // Guardamos el email para que el Header lo muestre inmediatamente
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

  // 4. Manejar Cierre de sesión
  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setCurrentUser({ name: '', avatar: '', email: '' });
    setCards([]);
    navigate('/sign-in', { replace: true });
  };

  // Placeholders para las tarjetas (se implementarán en el siguiente paso)
  const handleCardLike = (card) => {
    console.log("Dar like a:", card);
  };

  const handleCardDelete = (card) => {
    console.log("Eliminar tarjeta:", card);
  };

  // Función para cerrar todos los popups
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

      {/* Modales con renderizado condicional específico */}
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
      
      <Footer />
    </CurrentUserContext.Provider>
  );
}

export default App;
