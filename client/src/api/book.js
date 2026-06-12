import request from '@/utils/request';

/**
 * 获取图书列表（支持关键词检索、分类筛选、分页）
 */
export const getBooks = (params) => request.get('/books', { params });

/**
 * 获取图书详情
 */
export const getBookById = (id) => request.get(`/books/${id}`);

/**
 * 获取热门图书排行榜
 */
export const getHotBooks = (params) => request.get('/books/hot', { params });

/**
 * 获取新书上架
 */
export const getNewBooks = (params) => request.get('/books/new', { params });

/**
 * 新增图书（管理员）
 */
export const createBook = (data) => request.post('/books', data);

/**
 * 编辑图书（管理员）
 */
export const updateBook = (id, data) => request.put(`/books/${id}`, data);

/**
 * 下架图书（管理员）
 */
export const removeBook = (id) => request.put(`/books/${id}/remove`);
