import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (username, password) =>
  api.post('/api/login/', { username, password });

export const registerUser = (username, email, password, fullName = '', role = '', department = '') =>
  api.post('/api/register/', { username, email, password, full_name: fullName, role, department });

export const getTasks = () => api.get('/api/tasks/');
export const createTask = (payload) => api.post('/api/tasks/', payload);
export const deleteTask = (taskId) => api.delete(`/api/tasks/${taskId}/`);
export const getTeams = () => api.get('/api/teams/');
export const getComments = (taskId) =>
  api.get('/api/comments/', { params: { task: taskId } });
export const postComment = (taskId, text) =>
  api.post('/api/comments/', { task: taskId, text });
