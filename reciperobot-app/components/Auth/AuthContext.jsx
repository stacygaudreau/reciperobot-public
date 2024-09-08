/*
    Authenticated user context for Recipe Robot
*/

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// const API_URL = 'http://localhost:8000/api';  
const API_URL = 'https://reciperobot.net/api';
const AUTH_URL = `${API_URL}/auth`;

export const AuthStateProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Get a CSRF token from the cookie received from the backend */
  const getCsrfToken = () => {
    const cookies = document.cookie.split('; ');
    let csrf = null;
    for (let cookie of cookies) {
      if (cookie.startsWith('csrftoken=')) {
        csrf = cookie.split('=')[1];
        break;
      }
    }
    return csrf;
  }
  
  /** The API client, configured to send appropriate 
   * headers with each call */
  const apiClient = axios.create({
    baseURL: `${API_URL}`,
    withCredentials: true,
  });

  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    // const csrf = Cookies.get('csrftoken');
    const csrfToken = getCsrfToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    if (csrfToken) {
      // inject csrf token into request header
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  }, (err) => {
    return Promise.reject(err);
  });

  /** Clear all trace of user and local token from browser */
  const deleteUserAndToken = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    // obtain the active user on app load (if there is one)
    const sessionToken = localStorage.getItem('token');
    if (sessionToken) {
      axios.defaults.headers.common['Authorization'] = `Token ${sessionToken}`;
      axios
        .get(`${AUTH_URL}/user/`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error('Error getting user! ', err);
        });
    }
    setIsLoading(false);
  }, []);

  /** Fetch the user from the backend, storing the object into local
   * storage, given a valid auth token. */
  const getAndStoreUser = async (token) => {
    try {
      // store token in local storage and set axios to use it
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      // get user object
      const userRes = await apiClient.get(`${AUTH_URL}/user/`);
      const userData = userRes.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      throw err;
    }
  };

  /** Login to a new user session. The token is stored in
   * local session storage when successful. */
  const login = async (username, password) => {
    deleteUserAndToken();
    try {
      // log in and set auth token
      const res = await apiClient.post(`${AUTH_URL}/login/`, {
        username,
        password,
      });
      await getAndStoreUser(res.data.key);
    } catch (err) {
      throw err;
    }
  };

  /** Log out of the current user session */
  const logout = async () => {
    try {
      await apiClient.post(`${AUTH_URL}/logout/`);
      deleteUserAndToken();
    } catch (err) {
      console.error('Error while logging out: ', err);
    }
  };

  /** Request registration for a new user account signup.
   */
  const signup = async (username, email, password1, password2) => {
    deleteUserAndToken();
    try {
      const res = await apiClient.post(`${AUTH_URL}/registration/`, {
        username,
        email,
        password1,
        password2,
      });
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signup, isLoading, apiClient }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => {
  return useContext(AuthContext);
};
