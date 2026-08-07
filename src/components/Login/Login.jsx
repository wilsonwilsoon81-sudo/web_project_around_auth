import React from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    onLogin(email.trim(), password.trim());
  }

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Iniciar sesión</h2>
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
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default Login;
