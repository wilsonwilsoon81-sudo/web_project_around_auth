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
import * as api from '../utils/api'; // ✅ Importamos el nuevo módulo

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
        .then((user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          // Si el usuario es válido, cargamos sus tarjetas
          return api.getInitialCards(token);
        })
        .then((cardsData) => {
          setCards(cardsData);
        })
        .catch((err) => {
          console.error('Token inválido o expirado:', err);
          localStorage.removeItem('jwt');
          setIsLoggedIn(false);
        });
    }
  }, []);

  // 2. Manejar Registro
  const handleRegister = ({ email, password }) => {
    api.register(email, password)
      .then(() => {
        setIsRegisterSuccess(true);
        setIsInfoTooltipOpen(true);
        // Redirigir al login después de registrar
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
        // La API de TripleTen devuelve { token: "..." }
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setIsLoggedIn(true);
          setCurrentUser((prev) => ({ ...prev, email: email }));
          navigate('/', { replace: true });
        }
      })
      .catch((err) => {
        console.error('Error en login:', err);
        // Opcional: mostrar tooltip de error
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

  const handleCardLike = (card) => {
    console.log("Dar like a:", card);
    // Aquí irá la lógica de la API para dar like en el próximo paso
  };

  const handleCardDelete = (card) => {
    console.log("Eliminar tarjeta:", card);
    // Aquí irá la lógica de la API para eliminar en el próximo paso
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

        {/* Modales solo si está logueado */}
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

        {/* Tooltip de registro (puede estar fuera porque se controla con su propio estado) */}
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
