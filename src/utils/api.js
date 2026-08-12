const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

const handleResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
};

// --- AUTENTICACIÓN Y USUARIO ---
export const getUserInfo = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }).then(handleResponse);
};

export const updateUserInfo = (token, { name, about }) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, about }),
  }).then(handleResponse);
};

export const updateAvatar = (token, { avatar }) => {
  return fetch(`${BASE_URL}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ avatar }),
  }).then(handleResponse);
};

// --- TARJETAS ---
export const getInitialCards = (token) => {
  return fetch(`${BASE_URL}/cards`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }).then(handleResponse);
};

export const addCard = (token, { name, link }) => {
  return fetch(`${BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, link }),
  }).then(handleResponse);
};

export const deleteCard = (token, cardId) => {
  return fetch(`${BASE_URL}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }).then(handleResponse);
};

export const updateCardLike = (token, cardId, isLiked) => {
  const method = isLiked ? 'PUT' : 'DELETE';
  return fetch(`${BASE_URL}/cards/${cardId}/likes`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }).then(handleResponse);
};
