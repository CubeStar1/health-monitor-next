"use client";

import { HealthData } from '@/lib/types/health-types';
import { useState, useCallback } from 'react';

// Helper function to calculate Pearson correlation
function calculatePearsonCorrelation(
  data1: (number | null | undefined)[],
  data2: (number | null | undefined)[]
): number | null {
  const validPairs = data1
    .map((val1, i) => [val1, data2[i]])
    .filter(
      (pair) =>
        pair[0] !== null &&
        pair[0] !== undefined &&
        !isNaN(pair[0] as number) &&
        pair[1] !== null &&
        pair[1] !== undefined &&
        !isNaN(pair[1] as number)
    )
    .map(pair => [pair[0] as number, pair[1] as number]);

  if (validPairs.length < 2) { // Need at least 2 points to correlate
    return null;
  }

  const n = validPairs.length;
  const x = validPairs.map(p => p[0]);
  const y = validPairs.map(p => p[1]);

  const sumX = x.reduce((acc, val) => acc + val, 0);
  const sumY = y.reduce((acc, val) => acc + val, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;

  for (let i = 0; i < n; i++) {
    const devX = x[i] - meanX;
    const devY = y[i] - meanY;
    numerator += devX * devY;
    sumSqX += devX * devX;
    sumSqY += devY * devY;
  }

  const denominator = Math.sqrt(sumSqX * sumSqY);
  if (denominator === 0) {
    // This case means one or both variables have zero variance (all values are the same).
    // Correlation is undefined or can be considered 0 if there's no linear relationship.
    // Or, if one variable is constant and the other varies, it's also typically 0.
    return 0; 
  }

  return numerator / denominator;
}

export interface CorrelationResult {
  metric1: keyof HealthData;
  metric2: keyof HealthData;
  correlation: number | null;
  dataPoints: number;
}

interface UseCorrelationAnalysisReturn {
  correlations: CorrelationResult[];
  calculateCorrelations: (
    data: HealthData[],
    metricsToCorrelate: (keyof HealthData)[]
  ) => void;
  loading: boolean;
  error: Error | null;
}

export function useCorrelationAnalysis(): UseCorrelationAnalysisReturn {
  const [correlations, setCorrelations] = useState<CorrelationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const calculateCorrelations = useCallback(
    (data: HealthData[], metricsToCorrelate: (keyof HealthData)[]) => {
      if (!data || data.length === 0) {
        setError(new Error("No data provided for correlation analysis."));
        setCorrelations([]);
        return;
      }
      if (metricsToCorrelate.length < 2) {
        setError(new Error("Please select at least two metrics to correlate."));
        setCorrelations([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const results: CorrelationResult[] = [];
        for (let i = 0; i < metricsToCorrelate.length; i++) {
          for (let j = i + 1; j < metricsToCorrelate.length; j++) {
            const metric1Key = metricsToCorrelate[i];
            const metric2Key = metricsToCorrelate[j];

            const data1 = data.map(item => item[metric1Key]);
            const data2 = data.map(item => item[metric2Key]);
            
            const validPairsCount = data1
              .filter((val1, k) => 
                val1 !== null && val1 !== undefined && !isNaN(val1 as number) &&
                data2[k] !== null && data2[k] !== undefined && !isNaN(data2[k] as number)
              ).length;

            const correlation = calculatePearsonCorrelation(data1 as number[], data2 as number[]);
            results.push({ metric1: metric1Key, metric2: metric2Key, correlation, dataPoints: validPairsCount });
          }
        }
        setCorrelations(results);
      } catch (e) {
        setError(e as Error);
        setCorrelations([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { correlations, calculateCorrelations, loading, error };
}
