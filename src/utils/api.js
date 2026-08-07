class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  getUserInfo(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        ...this._headers,
        // ⚠️ EXACTAMENTE COMO DICE EL BRIEF
        authorization: `Bearer ${token}`, 
      },
    }).then(this._checkResponse.bind(this));
  }

  updateUserInfo(name, about, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, about }),
    }).then(this._checkResponse.bind(this));
  }

  updateUserAvatar(avatarUrl, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar: avatarUrl }),
    }).then(this._checkResponse.bind(this));
  }

  getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        ...this._headers,
        authorization: `Bearer ${token}`,
      },
    }).then(this._checkResponse.bind(this));
  }

  addNewCard(name, link, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, link }),
    }).then(this._checkResponse.bind(this));
  }

  deleteCard(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        authorization: `Bearer ${token}`,
      },
    }).then(this._checkResponse.bind(this));
  }

  toggleLike(cardId, isLiked, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: {
        ...this._headers,
        authorization: `Bearer ${token}`,
      },
    }).then(this._checkResponse.bind(this));
  }
}

// ⚠️ URL UNIFICADA SEGÚN EL BRIEF (Misma que auth.js)
const api = new Api({
  baseUrl: "https://se-register-api.en.tripleten-services.com/v1",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

export default api;
