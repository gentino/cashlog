// import axios from 'axios';

// // Since we're testing on web, both frontend and backend run on the same machine.
// // If you switch to a physical phone/emulator later, this needs to change to your
// // computer's local network IP (e.g. http://192.168.1.42:8000) instead of 127.0.0.1,
// // since the phone can't reach "localhost" meaning itself.
// const BASE_URL = 'http://127.0.0.1:8000/api';


// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000, // 10 seconds - avoids requests hanging forever if the server is unreachable
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Attaches the auth token to every request after login.
// // Call this once after login/register succeeds, and again on app startup
// // once we load a saved token from storage.
// export function setAuthToken(token) {
//   if (token) {
//     api.defaults.headers.common['Authorization'] = `Token ${token}`;
//   } else {
//     delete api.defaults.headers.common['Authorization'];
//   }
// }

// export default api;


import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Allows AuthContext to register a callback that runs whenever any request gets a 401,
// so we can force-logout the user from one central place instead of every screen
// individually checking for expired sessions.
let onUnauthorized = null;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default api;