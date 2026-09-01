import axios from 'axios';

// Create an Axios instance with base URL from environment variables
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

/* ================= RECIPES API (PUBLIC / OPEN) ================= */

export const fetchRecipes = async () => {
  const response = await API.get('/recipes');
  return response.data;
};

export const fetchMyRecipes = async () => {
  const response = await API.get('/recipes/my/user');
  return response.data;
};

export const fetchRecipeById = async (id) => {
  const response = await API.get(`/recipes/${id}`);
  return response.data;
};

export const createRecipe = async (formData) => {
  const response = await API.post('/recipes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateRecipe = async (id, formData) => {
  const response = await API.put(`/recipes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await API.delete(`/recipes/${id}`);
  return response.data;
};

export default API;
