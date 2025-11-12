import axios from 'axios';

const API = 'http://localhost:8088/api/items';

// 🔍 Fetch lost and found items
export const getLostItems = () => axios.get(`${API}/lost`);
export const getFoundItems = () => axios.get(`${API}/found`);

// 📝 Post new lost or found item
export const postLostItem = (item) => axios.post(`${API}/lost`, item);
export const postFoundItem = (item) => axios.post(`${API}/found`, item);

// 📜 Get all items submitted by a user
export const getUserHistory = (email) => axios.get(`${API}/history/${email}`);

// 🔍 Get item by ID
export const getItemById = (id) => axios.get(`${API}/${id}`);

// ✏️ Update item by ID (with image support)
export const updateItemById = (id, updatedData) =>
  axios.put(`${API}/${id}`, updatedData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// 🔍 Get potential matches for a given item (based on similarity)
export const getMatchedItems = (itemId) =>
  axios.get(`${API}/matches/${itemId}`);

// ✅ Mark two items as matched (bidirectional link)
export const markItemsAsMatched = (itemId, matchedId) =>
  axios.post(`${API}/match`, { itemId, matchedId });

// 🧩 Get confirmed match for a specific item
export const getConfirmedMatches = (itemId) =>
  axios.get(`${API}/confirmed-matches/${itemId}`);

// 🧩 Get all confirmed matches submitted by a user
export const getConfirmedMatchesForUser = (email) =>
  axios.get(`${API}/confirmed-history/${email}`);

// 🔄 Get matched pairs involving the user (both submitted and matched-to items)
export const getMatchedPairs = (email) =>
  axios.get(`${API}/matched-pairs/${email}`);