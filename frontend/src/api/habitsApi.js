import axiosClient from './axiosClient';

export const getHabits = async () => {
  const response = await axiosClient.get('/habits');
  return response.data;
};

export const createHabit = async (habitData) => {
  const response = await axiosClient.post('/habits', habitData);
  return response.data;
};

export const getHabitById = async (id) => {
  const response = await axiosClient.get(`/habits/${id}`);
  return response.data;
};

export const updateHabit = async (id, habitData) => {
  const response = await axiosClient.put(`/habits/${id}`, habitData);
  return response.data;
};

export const deleteHabit = async (id) => {
  const response = await axiosClient.delete(`/habits/${id}`);
  return response.data;
};
