import axiosClient from './axiosClient';

export const getAnalytics = async () => {
  const response = await axiosClient.get('/analytics');
  return response.data;
};
