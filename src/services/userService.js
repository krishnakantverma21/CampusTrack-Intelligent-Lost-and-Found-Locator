import axios from 'axios';

export const getUserByEmail = (email) =>
  axios.get(`http://localhost:8088/api/auth/user?email=${email}`);

export const uploadProfileImage = (email, formData) =>
  axios.patch(`http://localhost:8088/api/auth/${email}/profile-image`, formData);