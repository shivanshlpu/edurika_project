import { useState } from 'react';
import { predict } from '../utils/api';

export const usePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runPrediction = async (symptoms) => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await predict(symptoms);
      setResults(response.data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.response?.data?.detail || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, results, error, runPrediction, setResults };
};
