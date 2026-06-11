import request from '@/utils/request';

export const getMessages = (params) => request.get('/messages', { params });
export const readMessage = (id) => request.put(`/messages/${id}/read`);
export const readAll = () => request.put('/messages/read-all');
export const getUnreadCount = () => request.get('/messages/unread-count');
