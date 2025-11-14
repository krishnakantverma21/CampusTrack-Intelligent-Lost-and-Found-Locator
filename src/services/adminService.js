import axios from 'axios';

const API = 'http://localhost:8088/api/admin';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const headersWithEmail = (email) => ({
  ...authHeaders(),
  'X-User-Email': email
});

// 🔍 Flagged Posts & Analytics
export const getFlaggedPosts = (email) =>
  axios.get(`${API}/flags`, { headers: headersWithEmail(email) });

export const getAnalytics = (email) =>
  axios.get(`${API}/analytics`, { headers: headersWithEmail(email) });

export const markFlagAsReviewed = (flagId, email) =>
  axios.put(`${API}/flags/${flagId}/review`, null, { headers: headersWithEmail(email) });

// 👥 User Management
export const getAllUsers = (email) =>
  axios.get(`${API}/users`, { headers: headersWithEmail(email) });

export const deleteUserByEmail = (targetEmail, email) =>
  axios.delete(`${API}/user/${targetEmail}`, { headers: headersWithEmail(email) });

// 📦 Item Management
export const getAllItems = (email) =>
  axios.get(`${API}/items`, { headers: headersWithEmail(email) });

export const deleteItemById = (id, email) =>
  axios.delete(`${API}/item/${id}`, { headers: headersWithEmail(email) });

// 💬 Message Management
export const getAllMessages = (email) =>
  axios.get(`${API}/messages`, { headers: headersWithEmail(email) });

export const deleteMessageById = (id, email) =>
  axios.delete(`${API}/message/${id}`, { headers: headersWithEmail(email) });