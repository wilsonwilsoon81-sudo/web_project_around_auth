class Auth {
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

  register(email, password) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ email, password }),
    }).then(this._checkResponse.bind(this));
  }

  login(email, password) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ email, password }),
    }).then(this._checkResponse.bind(this));
  }
}

// ⚠️ URL UNIFICADA SEGÚN EL BRIEF
const auth = new Auth({
  baseUrl: "https://se-register-api.en.tripleten-services.com/v1",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

export default auth;
