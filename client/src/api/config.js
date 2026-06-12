import request from '@/utils/request';

export const getConfigs = () => request.get('/configs');
export const updateConfig = (key, data) => request.put(`/configs/${key}`, data);
