import axios from 'axios';

const API = 'http://localhost:8088/api/matches';

export const getMatches = (itemId) => axios.get(`${API}/${itemId}`);