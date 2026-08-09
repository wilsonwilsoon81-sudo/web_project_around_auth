import { Link, useLocation } from 'react-router-dom';
import logo from '../../images/logo.svg';
import '../../blocks/Header.css';

function Header({ loggedIn, email, onSignOut }) {
  const location = useLocation();

  // Si está en la página de registro
  if (location.pathname === '/sign-up') {
    return (
      <header className="header">
        <img src={logo} alt="Logo Around" className="header__logo" />
      </header>
    );
  }

  // Si está en la página de login
  if (location.pathname === '/sign-in') {
    return (
      <header className="header">
        <img src={logo} alt="Logo Around" className="header__logo" />
        <Link to="/sign-up" className="header__link">
          Regístrate
        </Link>
      </header>
    );
  }

  // Si está logueado (página principal)
  if (loggedIn) {
    return (
      <header className="header header_logged">
        <img src={logo} alt="Logo Around" className="header__logo" />
        <div className="header__user">
          <p className="header__email">{email}</p>
          <button 
            type="button" 
            className="header__logout"
            onClick={onSignOut}
          >
            Cerrar sesión
          </button>
        </div>
      </header>
    );
  }

  return null;
}

export default Header;
