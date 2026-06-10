import request from '@/utils/request';

export const register = (data) => request.post('/users/register', data);
export const login = (data) => request.post('/users/login', data);
export const getMe = () => request.get('/users/me');
export const updateMe = (data) => request.put('/users/me', data);
export const changePassword = (data) => request.put('/users/me/password', data);
export const getMyRecords = (params) => request.get('/users/me/records', { params });
export const getUsers = (params) => request.get('/users', { params });
export const updateUserStatus = (id, data) => request.put(`/users/${id}/status`, data);
export const resetPassword = (id, data) => request.put(`/users/${id}/reset-password`, data);
