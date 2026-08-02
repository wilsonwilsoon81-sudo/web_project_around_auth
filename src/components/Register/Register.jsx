import React from 'react';

function Register({ onRegister }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onRegister(email, password);
  }

  return (
    <div className="register">
      <h2 className="register__title">Registro</h2>
      <form className="register__form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="register__input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="register__input"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="register__button">
          Registrarse
        </button>
      </form>
      <p className="register__text">
        ¿Ya eres miembro? <a href="/signin" className="register__link">Inicia sesión aquí</a>
      </p>
    </div>
  );
}

export default Register;
