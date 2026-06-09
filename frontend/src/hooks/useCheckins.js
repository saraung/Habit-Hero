import { useState, useEffect, useCallback } from 'react';
import { getHabitCheckins, createCheckin } from '../api/checkinsApi';

const useCheckins = (habitId) => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchCheckins = useCallback(async () => {
    if (!habitId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHabitCheckins(habitId);
      setCheckins(data);
    } catch (err) {
      setError(err.message || 'Failed to load check-ins');
    } finally {
      setLoading(false);
    }
  }, [habitId]);

  const addCheckin = useCallback(
    async (checkinData) => {
      setSubmitting(true);
      setError(null);
      try {
        const newCheckin = await createCheckin(checkinData);
        setCheckins((prev) => [newCheckin, ...prev]);
        return newCheckin;
      } catch (err) {
        throw new Error(err.message || 'Failed to create check-in');
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  return { checkins, loading, submitting, error, addCheckin, refresh: fetchCheckins };
};

export default useCheckins;
