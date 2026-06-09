import axiosClient from './axiosClient';

export const createCheckin = async (checkinData) => {
  const response = await axiosClient.post('/checkins', checkinData);
  return response.data;
};

export const getHabitCheckins = async (habitId) => {
  const response = await axiosClient.get(`/checkins/habit/${habitId}`);
  return response.data;
};
