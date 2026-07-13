const BASE_URL = 'https://freelanceguard.alwaysdata.net/api';

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = 'Request failed';
    try {
      const cloned = res.clone();
      const errorData = await cloned.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      try {
        errorMessage = await res.text();
      } catch {}
    }
    throw new Error(errorMessage);
  }

  return res.json();
};