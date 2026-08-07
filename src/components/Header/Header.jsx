import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from "../../images/logo.svg";

function Header({ loggedIn, onSignOut, email }) {
  const location = useLocation();

  return (
    <header className="header page__section">
      <img
        alt="Logotipo Around The U.S."
        className="logo header__logo"
        src={logo}
      />
      {loggedIn && location.pathname === '/' && (
        <div className="header__user-info">
          <p className="header__email">{email}</p>
          <button className="header__sign-out" onClick={onSignOut}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
