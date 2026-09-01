import axios from 'axios';

// Create an Axios instance for the Admin Portal
const AdminAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Intercept requests and attach admin JWT token
AdminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('recipe_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthorized
AdminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (localStorage.getItem('recipe_admin_token')) {
        localStorage.removeItem('recipe_admin_token');
        localStorage.removeItem('recipe_admin_user');
      }
    }
    return Promise.reject(error);
  }
);

/* ================= AUTH ================= */

export const loginAdmin = async ({ email, password }) => {
  const res = await AdminAPI.post('/auth/login', { email, password });
  return res.data;
};

export const registerAdmin = async ({ name, email, password }) => {
  const res = await AdminAPI.post('/auth/register', { name, email, password, role: 'admin' });
  return res.data;
};

/* ================= DASHBOARD & ANALYTICS ================= */

export const fetchAdminStats = async () => {
  const res = await AdminAPI.get('/admin/stats');
  return res.data;
};

/* ================= RECIPES ================= */

export const fetchAdminRecipes = async (search = '') => {
  const res = await AdminAPI.get(`/admin/recipes${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  return res.data;
};

export const createAdminRecipe = async (formData) => {
  const res = await AdminAPI.post('/admin/recipes/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateAdminRecipe = async (id, formData) => {
  const res = await AdminAPI.put(`/admin/recipes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteAdminRecipe = async (id) => {
  const res = await AdminAPI.delete(`/admin/recipes/${id}`);
  return res.data;
};

/* ================= USER & CHEF ACCOUNTS (FULL CRUD) ================= */

export const fetchAdminUsers = async () => {
  const res = await AdminAPI.get('/admin/users');
  return res.data;
};

export const createAdminUser = async (data) => {
  const res = await AdminAPI.post('/admin/users', data);
  return res.data;
};

export const updateAdminUser = async (id, data) => {
  const res = await AdminAPI.put(`/admin/users/${id}`, data);
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await AdminAPI.put(`/admin/users/${id}/role`, { role });
  return res.data;
};

export const deleteAdminUser = async (id) => {
  const res = await AdminAPI.delete(`/admin/users/${id}`);
  return res.data;
};

export const fetchUserRecipes = async (userId) => {
  const res = await AdminAPI.get(`/admin/users/${userId}/recipes`);
  return res.data;
};

/* ================= ADMIN TEAM & SETTINGS ================= */

export const fetchAdminTeam = async () => {
  const res = await AdminAPI.get('/admin/admins');
  return res.data;
};

export const createAdminAccount = async ({ name, email, password }) => {
  const res = await AdminAPI.post('/admin/admins', { name, email, password });
  return res.data;
};

export const updateAdminAccount = async (id, data) => {
  const res = await AdminAPI.put(`/admin/admins/${id}`, data);
  return res.data;
};

export const deleteAdminAccount = async (id) => {
  const res = await AdminAPI.delete(`/admin/admins/${id}`);
  return res.data;
};

/* ================= SYSTEM & CLAIMS ================= */

export const claimAdminRole = async () => {
  const res = await AdminAPI.post('/admin/claim-admin');
  return res.data;
};

export default AdminAPI;
