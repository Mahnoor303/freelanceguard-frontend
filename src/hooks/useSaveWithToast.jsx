import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';

export function useSaveWithToast() {
  const [loading, setLoading] = useState(false);

  const save = async (endpoint, options, successMsg = 'Saved successfully!') => {
    setLoading(true);
    try {
      const data = await api(endpoint, options);
      toast.success(successMsg);
      return data;
    } catch (error) {
      toast.error(error.message || 'Save failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { save, loading };
}