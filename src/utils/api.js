const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

// Función auxiliar para manejar las respuestas y errores
const checkResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
};

// 1. Registro de usuario
export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
};

// 2. Inicio de sesión (Autorización)
export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
};

// 3. Obtener información del usuario (PROTEGIDO)
export const getUserInfo = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // ✅ CLAVE: Enviamos el token
    },
  }).then(checkResponse);
};

// 4. Obtener las tarjetas iniciales (PROTEGIDO)
export const getInitialCards = (token) => {
  return fetch(`${BASE_URL}/cards`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // ✅ CLAVE: Enviamos el token
    },
  }).then(checkResponse);
};

// (Opcional) Si tu proyecto usa agregar/eliminar tarjetas, aquí irían esos métodos 
// también con el header 'Authorization': `Bearer ${token}`
