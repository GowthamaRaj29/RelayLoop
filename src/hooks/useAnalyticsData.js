import { useState, useEffect } from 'react';

// Helper function to generate mock data
const generateMockData = (dateRange) => {
  const { startDate, endDate } = dateRange;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // Generate daily data
  const dailyData = Array.from({ length: days }, (_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      admissions: Math.floor(Math.random() * 30) + 20,
      readmissions: Math.floor(Math.random() * 15) + 5,
    };
  });

  // Generate department data
  const departments = [
    { id: 1, name: 'Cardiology', cases: Math.floor(Math.random() * 100) + 50 },
    { id: 2, name: 'Neurology', cases: Math.floor(Math.random() * 100) + 50 },
    { id: 3, name: 'Oncology', cases: Math.floor(Math.random() * 100) + 50 },
    { id: 4, name: 'Pediatrics', cases: Math.floor(Math.random() * 100) + 50 },
    { id: 5, name: 'Emergency', cases: Math.floor(Math.random() * 100) + 50 },
  ];

  // Calculate risk scores
  const riskScores = [
    { range: '0-20%', count: Math.floor(Math.random() * 100) + 50 },
    { range: '21-40%', count: Math.floor(Math.random() * 100) + 50 },
    { range: '41-60%', count: Math.floor(Math.random() * 100) + 50 },
    { range: '61-80%', count: Math.floor(Math.random() * 100) + 50 },
    { range: '81-100%', count: Math.floor(Math.random() * 100) + 50 },
  ];

  return {
    admissions: dailyData,
    readmissions: dailyData.map(d => ({ ...d, count: d.readmissions })),
    departments,
    riskScores,
    summary: {
      totalAdmissions: dailyData.reduce((sum, d) => sum + d.admissions, 0),
      totalReadmissions: dailyData.reduce((sum, d) => sum + d.readmissions, 0),
      avgLengthOfStay: Math.floor(Math.random() * 3) + 4,
      departmentPerformance: departments,
      readmissionRate: (dailyData.reduce((sum, d) => sum + d.readmissions, 0) / 
                       dailyData.reduce((sum, d) => sum + d.admissions, 0) * 100).toFixed(1)
    }
  };
};

export const useAnalyticsData = (dateRange) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
        setError('Invalid date range');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Generate mock data
        const mockData = generateMockData(dateRange);
        setData(mockData);
      } catch (err) {
        console.error('Error in useAnalyticsData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return { data, loading, error };
};