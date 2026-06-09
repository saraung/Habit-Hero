import axiosClient from './axiosClient';

/**
 * POST /ai/analyze-note
 * Request:  { note: string }
 * Response: { mood: string, score: number, recommendation: string }
 */
export const analyzeNote = async (note) => {
  const response = await axiosClient.post('/ai/analyze-note', { note });
  return response.data;
};

/**
 * GET /ai/recommendations
 * Response: { recommendations: string[] }
 */
export const getRecommendations = async () => {
  const response = await axiosClient.get('/ai/recommendations');
  return response.data;
};
