import request from '@/utils/request';

// 4.4.1 统计概览（需管理员）
export const getOverview = () => request.get('/stats/overview');

// 4.4.2 借阅趋势（需管理员）
export const getBorrowTrend = (params) => request.get('/stats/borrow-trend', { params });

// 4.4.3 热门图书排行榜（需管理员）
export const getHotBooks = (params) => request.get('/stats/hot-books', { params });

// 4.4.4 分类分布（需管理员）
export const getCategoryDistribution = () => request.get('/stats/category-distribution');
