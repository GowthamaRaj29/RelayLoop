import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * ReadmissionRateChart - Shows a line chart of readmission rates over time
 */
export function ReadmissionRateChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    // If no chart container exists yet, return early
    if (!chartRef.current) return;
    
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Default data if none provided
    const chartData = data || {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      datasets: [
        {
          label: 'Readmission Rate (%)',
          data: [12.5, 11.8, 13.2, 14.1, 12.9, 11.5, 10.8, 11.2, 12.4],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        }
      ]
    };
    
    // Create new chart
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Rate (%)'
            },
            min: 0,
            max: 20,
            ticks: {
              stepSize: 5
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    });
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);
  
  return (
    <div className="h-80">
      <canvas ref={chartRef} />
    </div>
  );
}

/**
 * PatientRiskDistribution - Shows a doughnut chart of patient risk levels
 */
export function PatientRiskDistribution({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    // If no chart container exists yet, return early
    if (!chartRef.current) return;
    
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Default data if none provided
    const chartData = data || {
      labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: [
            'rgba(34, 197, 94, 0.7)', // green
            'rgba(234, 179, 8, 0.7)',  // yellow
            'rgba(249, 115, 22, 0.7)', // orange
            'rgba(239, 68, 68, 0.7)',  // red
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(234, 179, 8)',
            'rgb(249, 115, 22)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 1
        }
      ]
    };
    
    // Create new chart
    chartInstance.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);
  
  return (
    <div className="h-80">
      <canvas ref={chartRef} />
    </div>
  );
}

/**
 * DepartmentPerformanceChart - Shows a bar chart of readmissions by department
 */
export function DepartmentPerformanceChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    // If no chart container exists yet, return early
    if (!chartRef.current) return;
    
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Default data if none provided
    const chartData = data || {
      labels: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics'],
      datasets: [
        {
          label: 'Readmission Rate (%)',
          data: [14.2, 9.8, 16.5, 8.3, 7.6],
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1
        }
      ]
    };
    
    // Create new chart
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw || 0;
                return `Rate: ${value}%`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Rate (%)'
            },
            max: 20
          }
        }
      }
    });
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);
  
  return (
    <div className="h-80">
      <canvas ref={chartRef} />
    </div>
  );
}

/**
 * PredictionAccuracyChart - Shows a line chart of prediction model accuracy over time
 */
export function PredictionAccuracyChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    // If no chart container exists yet, return early
    if (!chartRef.current) return;
    
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Default data if none provided
    const chartData = data || {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      datasets: [
        {
          label: 'Model Accuracy',
          data: [82, 84, 83, 86, 87, 85, 88, 89, 91],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Prediction Count',
          data: [210, 242, 264, 287, 312, 334, 356, 389, 412],
          borderColor: 'rgb(124, 58, 237)',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3,
          fill: false,
          yAxisID: 'y1'
        }
      ]
    };
    
    // Create new chart
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Accuracy (%)'
            },
            min: 70,
            max: 100
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            title: {
              display: true,
              text: 'Prediction Count'
            },
            min: 0
          }
        }
      }
    });
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);
  
  return (
    <div className="h-80">
      <canvas ref={chartRef} />
    </div>
  );
}
