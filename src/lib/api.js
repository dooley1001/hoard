import { handleApiErrors } from 'lib/api-errors';

async function apiWrapper(url, options) {
  const response = await fetch(url, options);
  await handleApiErrors(response);

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return response.text();
  }
}

const api = {
  async get(url, options = {}) {
    return apiWrapper(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      ...options,
    });
  },

  async post(url, body, options = {}) {
    return apiWrapper(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body && JSON.stringify(body),
      ...options,
    });
  },

  async put(url, body, options = {}) {
    return apiWrapper(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body && JSON.stringify(body),
      ...options,
    });
  },

  async delete(url, options = {}) {
    return apiWrapper(url, {
      method: 'DELETE',
      ...options,
    });
  },
};

export default api;
