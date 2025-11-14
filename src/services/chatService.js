import axios from 'axios';

const BASE_URL = 'http://localhost:8088/api/chat';

export const getMessages = (user1, user2) =>
  axios.get(`${BASE_URL}/history?user1=${user1}&user2=${user2}`);

export const sendMessage = (message) =>
  axios.post(`${BASE_URL}/send`, message);

export const getUnseenMessages = (receiverEmail) =>
  axios.get(`${BASE_URL}/notifications?receiverEmail=${receiverEmail}`);

export const markMessagesAsSeen = (messageIds) =>
  axios.post(`${BASE_URL}/mark-seen`, messageIds);

export const getConversations = (userEmail) =>
  axios.get(`${BASE_URL}/conversations?userEmail=${userEmail}`);

export const sendChatRequest = (payload) =>
  axios.post(`${BASE_URL}/request`, payload);

export const getPendingRequests = (receiverEmail) =>
  axios.get(`${BASE_URL}/requests?receiverEmail=${receiverEmail}`);

export const respondToChatRequest = (id, action) =>
  axios.put(`${BASE_URL}/request/${id}/${action}`);

export const checkChatPermission = async (userA, userB) => {
  const res = await axios.get(`${BASE_URL}/allowed?userA=${userA}&userB=${userB}`);
  return res.data.allowed;
};