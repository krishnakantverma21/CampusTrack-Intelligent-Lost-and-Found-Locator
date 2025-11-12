import axios from 'axios';

const API = 'http://localhost:8088/api/auth';

// Login: expects { email, passwordHash }
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API}/login`, credentials);
    return response;
  } catch (error) {
    throw error.response || error;
  }
};

// Signup: expects { name, email, passwordHash, role }
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API}/signup`, userData);
    return response;
  } catch (error) {
    throw error.response || error;
  }
};