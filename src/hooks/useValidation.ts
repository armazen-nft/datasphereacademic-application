import { useState } from 'react';
import type { ValidationResult } from '@/types/validation';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function useValidation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = async (text: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/papers/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Validation failed');
      }

      const data: ValidationResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { validate, loading, result, error };
}
