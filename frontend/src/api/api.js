import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const uploadFile = (taskId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/tasks/${taskId}/files`, formData, {
    headers: { 'Content-Type': undefined },
  });
};

export const downloadFile = (taskId, fileId) => {
  return api.get(`/tasks/${taskId}/files/${fileId}`, { responseType: 'blob' });
};

export default api;
