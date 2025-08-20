import axios from "axios";

export const fetchTasks = () =>
  axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, { withCredentials: true });

export const createTask = (task) =>
  axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, task, { withCredentials: true });

export const updateTask = (id, task) =>
  axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, task, { withCredentials: true });

export const deleteTask = (id) =>
  axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, { withCredentials: true });