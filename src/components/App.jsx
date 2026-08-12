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
import * as auth from '../utils/auth';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('jwt'));
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
    if (token) {
      Promise.all([
        api.getUserInfo(token)
          .then((res) => {
            setCurrentUser(res.data || res);
            setIsLoggedIn(true);
          })
          .catch(() => {
            localStorage.removeItem('jwt');
            setIsLoggedIn(false);
            setCurrentUser({ name: '', avatar: '', email: '' });
          }),

      api.getInitialCards(token)
          .then((cardsData) => {
            setCards(Array.isArray(cardsData) ? cardsData : []);
          })
          .catch(() => {
            setCards([]);
          })
      ]).finally(() => {
        setIsLoading(false);
      });
    } 
  }, []);  

  const handleRegister = ({ email, password }) => {
    auth.register(email, password)
      .then(() => {
        setIsRegisterSuccess(true);
        setIsInfoTooltipOpen(true);
        navigate('/signin');
      })
      .catch(() => {
        setIsRegisterSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  const handleLogin = ({ email, password }) => {
    auth.authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          return api.getUserInfo(data.token).then((res) => {
            setCurrentUser(res.data);
            setIsLoggedIn(true);
            navigate('/', { replace: true });
          });
        }
      })
      .catch(() => {
        setIsRegisterSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setCurrentUser({ name: '', avatar: '', email: '' });
    setCards([]);
    navigate('/signin', { replace: true });
  };

  const handleCardLike = (card) => {
    const token = localStorage.getItem('jwt');
    const isLiked = card.likes.some(id => id === currentUser._id || id._id === currentUser._id);
    
    api.updateCardLike(token, card._id, !isLiked)
      .then((updatedCard) => {
        setCards((prevCards) => prevCards.map((c) => (c._id === card._id ? updatedCard : c)));
      })
      .catch((err) => console.error("Error al dar like:", err));
  };

  const handleCardDelete = (card) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarjeta?")) return;
    const token = localStorage.getItem('jwt');

    api.deleteCard(token, card._id)
      .then(() => {
        setCards((prevCards) => prevCards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.error("Error al eliminar tarjeta:", err));
  };

  const handleUpdateUser = ({ name, about }) => {
    const token = localStorage.getItem('jwt');
    return api.updateUserInfo(token, { name, about })
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
      });
  };

  const handleUpdateAvatar = ({ avatar }) => {
    const token = localStorage.getItem('jwt');
    return api.updateAvatar(token, { avatar })
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
      });
  };

  const handleAddCard = ({ name, link }) => {
    const token = localStorage.getItem('jwt');
    return api.addCard(token, { name, link })
      .then((newCard) => {
        setCards((prevCards) => [newCard, ...prevCards]);
      });
  };

  const closeAllPopups = () => {
    setIsEditProfileOpen(false);
    setIsAddCardOpen(false);
    setIsEditAvatarOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  };

   if (isLoading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando...</div>;
  }

  return (
    <CurrentUserContext.Provider value={currentUser || { name: '', avatar: '', email: '' }}>
      <Header 
        loggedIn={isLoggedIn} 
        email={currentUser.email}
        onSignOut={handleSignOut}
      />
      
      <Routes>
        <Route path="/signup" element={<Register onRegister={handleRegister} />} />
        <Route path="/signin" element={<Login onLogin={handleLogin} />} />
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
        <EditProfile 
          isOpen={isEditProfileOpen}
          onClose={closeAllPopups} 
          onUpdateUser={handleUpdateUser} 
        />
      )}

      {isLoggedIn && isEditAvatarOpen && (
        <EditAvatar 
          isOpen={isEditAvatarOpen}
          onClose={closeAllPopups} 
          onUpdateAvatar={handleUpdateAvatar} 
        />
      )}

      {isLoggedIn && isAddCardOpen && (
        <NewCard 
          isOpen={isAddCardOpen}
          onClose={closeAllPopups} 
          onAddPlace={handleAddCard} 
        />
      )}

      {isLoggedIn && selectedCard && (
        <ImagePopup 
          card={selectedCard} 
          onClose={closeAllPopups} 
        />
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
