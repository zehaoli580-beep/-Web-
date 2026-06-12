import request from '@/utils/request';

/**
 * 获取分类列表
 */
export const getCategories = () => request.get('/categories');

/**
 * 新增分类（管理员）
 */
export const createCategory = (data) => request.post('/categories', data);

/**
 * 编辑分类（管理员）
 */
export const updateCategory = (id, data) => request.put(`/categories/${id}`, data);

/**
 * 删除分类（管理员）
 */
export const deleteCategory = (id) => request.delete(`/categories/${id}`);
