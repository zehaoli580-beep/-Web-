import request from '@/utils/request';

// 4.5.1 获取所有系统参数（需管理员）
export const getConfigs = () => request.get('/configs');

// 4.5.2 更新系统参数（需管理员）
export const updateConfig = (key, data) => request.put(`/configs/${key}`, data);
