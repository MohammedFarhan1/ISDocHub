import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Documents API
export const documentsAPI = {
  getDocuments: (memberName) => api.get(`/docs?memberName=${memberName || ''}`),
  downloadDocument: (id) => api.get(`/docs/download/${id}`, { responseType: 'blob' }),
  viewDocument: (id) => api.get(`/docs/view/${id}`, { responseType: 'blob' }),
};

// Admin API
export const adminAPI = {
  uploadDocument: (formData) => api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateDocument: (id, data) => api.put(`/admin/update/${id}`, data),
  deleteDocument: (id) => api.delete(`/admin/delete/${id}`),
  getAllDocuments: () => api.get('/admin/documents'),
  uploadMemberImage: (formData) => api.post('/admin/upload-member-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMemberImage: (memberName) => api.get(`/admin/member-image/${memberName}`, { responseType: 'blob' }),
};

export default api;