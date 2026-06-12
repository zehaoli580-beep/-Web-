import request from '@/utils/request';

// 4.3.1 借书申请（需登录）
export const borrowBook = (data) => request.post('/records/borrow', data);

// 管理员确认借书
export const confirmBorrow = (id) => request.put(`/records/${id}/confirm-borrow`);

// 4.3.2 确认归还（需管理员）
export const returnBook = (id) => request.put(`/records/${id}/return`);

// 4.3.3 续借（需登录）
export const renewBook = (id) => request.put(`/records/${id}/renew`);

// 4.3.4 预约图书（需登录）
export const reserveBook = (data) => request.post('/records/reserve', data);

// 4.3.5 获取所有借阅记录（需管理员）
export const getRecords = (params) => request.get('/records', { params });

// 4.3.6 获取待确认借书列表（需管理员）
export const getPendingBorrows = (params) => request.get('/records/pending-borrows', { params });

// 4.3.7 获取待确认还书列表（需管理员）
export const getPendingReturns = (params) => request.get('/records/pending-returns', { params });

// 获取当前用户的借阅记录
export const getMyRecords = () => request.get('/records/my');

// 获取当前用户的预约记录
export const getMyReservations = () => request.get('/records/my/reservations');
