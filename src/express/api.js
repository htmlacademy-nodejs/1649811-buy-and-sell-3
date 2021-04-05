'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {

  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async getOffers({offset, limit, comments} = {}) {
    return this._load(`/offers`, {params: {offset, limit, comments}});
  }

  async getMyOffers({offset, limit, comments} = {}) {
    return this._load(`/offers`, {params: {offset, limit, comments}});
  }

  async getCategoryOffers(id, {limit, offset} = {}) {
    return this._load(`/offers/category/${id}`, {params: {offset, limit}});
  }

  async getOffer(id, comments) {
    return this._load(`/offers/${id}`, {params: {comments}});
  }

  async search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  async createOffer(data) {
    return this._load(`/offers`, {
      method: `POST`,
      data
    });
  }

  async editOffer(id, data) {
    return this._load(`/offers/${id}`, {
      method: `PUT`,
      data
    });
  }

  async addComment(id, data) {
    return this._load(`/offers/${id}/comments`, {
      method: `POST`,
      data
    });
  }

  async createUser(data) {
    return this._load(`/user`, {
      method: `POST`,
      data
    });
  }

  async login(data) {
    return this._load(`/login`, {
      method: `POST`,
      data
    });
  }

  async refresh(refreshToken) {
    const data = {token: refreshToken};
    return this._load(`/refresh`, {
      method: `POST`,
      data
    });
  }

  async logout(accessToken, refreshToken) {
    const data = {token: refreshToken};
    return this._load(`/logout`, {
      method: `DELETE`,
      headers: {'Authorization': `Bearer: ${accessToken}`},
      data,
    });

  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
