import { useState, useEffect, useCallback } from 'react';
import { getHabits, deleteHabit } from '../api/habitsApi';

const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      setError(err.message || 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeHabit = useCallback(async (id) => {
    try {
      await deleteHabit(id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      throw new Error(err.message || 'Failed to delete habit');
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return { habits, loading, error, refresh: fetchHabits, removeHabit };
};

export default useHabits;
