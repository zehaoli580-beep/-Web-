import request from '@/utils/request';

// 用户登录
export const login = (data) => request.post('/users/login', data);

// 获取当前用户信息
export const getMe = () => request.get('/users/me');

// 用户注册
export const register = (data) => request.post('/users/register', data);

// 更新用户信息
export const updateMe = (data) => request.put('/users/me', data);

// 修改密码
export const changePassword = (data) => request.put('/users/me/password', data);

// 获取我的借阅记录
export const getMyRecords = (params) => request.get('/users/me/records', { params });

// 获取用户列表（管理员）
export const getUsers = (params) => request.get('/users', { params });

// 更新用户状态
export const updateUserStatus = (id, data) => request.put(`/users/${id}/status`, data);

// 重置密码
export const resetPassword = (id, data) => request.put(`/users/${id}/reset-password`, data);
