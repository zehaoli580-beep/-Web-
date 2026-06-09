import axios from 'axios';
import { ElMessage } from 'element-plus';

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 10000
});

// 请求拦截器：自动携带 Token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    const msg = error.response?.data?.message || '请求失败';
    ElMessage.error(msg);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request;
