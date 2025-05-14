import { useState, useCallback } from 'react';
import { fetchCompanyDescription } from '../services/api';

export default function useCompanyDescription() {
  const [description, setDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDescription = useCallback(async (companyNameInput) => {
    setLoading(true);
    setError(null);
    try {
      const { description: desc, companyName: resolvedName } = await fetchCompanyDescription(companyNameInput);
      setDescription(desc);
      setCompanyName(resolvedName);
    } catch (err) {
      setError('Failed to fetch company description');
      setDescription('');
      setCompanyName(companyNameInput);
    } finally {
      setLoading(false);
    }
  }, []);

  return { description, companyName, loading, error, getDescription };
} 