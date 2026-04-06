import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

export const getMessages = (userId) => api.get(`/messages?userId=${userId}`);
export const getPinnedMessages = () => api.get('/messages/pinned');
export const sendMessage = (data) => api.post('/messages', data);
export const deleteForMe = (messageId, userId) => api.delete(`/messages/${messageId}/me`, { data: { userId } });
export const deleteForEveryone = (messageId) => api.delete(`/messages/${messageId}/everyone`);
export const togglePin = (messageId) => api.patch(`/messages/${messageId}/pin`);

export default api;
