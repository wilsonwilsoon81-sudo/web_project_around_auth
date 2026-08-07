import React from 'react';

function Register({ onRegister }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    onRegister(email.trim(), password.trim());
  }

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Registro</h2>
      <form className="auth-form__form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          className="auth-form__input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          className="auth-form__input"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-form__button">
          Registrarse
        </button>
      </form>
      <p className="auth-form__text">
        ¿Ya eres miembro?{' '}
        <a href="/signin" className="auth-form__link">
          Inicia sesión aquí
        </a>
      </p>
    </div>
  );
}

export default Register;
