import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
// Import jsPDF with autoTable plugin
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, subDays, parseISO, isAfter, differenceInCalendarDays } from 'date-fns';
import {
  IconComponentPropTypes,
  StatCardPropTypes,
  ChartCardPropTypes,
  TableCardPropTypes
} from './AnalyticsTypes';

// Constants for analytics dashboard
const TABS = [
  { 
    id: 'overview',
    label: 'Overview',
    icon: 'chart-bar',
    description: 'Complete overview of key metrics and trends'
  },
  {
    id: 'readmissions',
    label: 'Readmissions',
    icon: 'refresh',
    description: 'Detailed analysis of patient readmissions'
  },
  {
    id: 'departments',
    label: 'Departments',
    icon: 'building',
    description: 'Department-wise performance metrics'
  }
];

const CHART_COLORS = {
  primary: '#60a5fa',
  secondary: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171'
};
// Single source of truth for time ranges
const TIME_RANGES = [
  { value: '7d', label: 'Last 7 Days', days: 7 },
  { value: '30d', label: 'Last 30 Days', days: 30 },
  { value: '90d', label: 'Last 90 Days', days: 90 },
  { value: '1y', label: 'Last Year', days: 365 }
];

// Icon Components
const IconComponent = ({ name, className = "h-5 w-5" }) => {
  const icons = {
    'chart-bar': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    'refresh': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    'chart-line': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    'building': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'arrow-up': (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ),
    'arrow-down': (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )
  };

  return icons[name] || null;
};

IconComponent.propTypes = IconComponentPropTypes;

// Card Components
const StatCard = ({ title, value, change, timeRange, icon }) => (
  <div className="bg-white overflow-hidden shadow-lg rounded-lg transition-all duration-200 hover:shadow-xl">
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            {icon && (
              <div className={`p-3 rounded-lg mr-3 ${
                change > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <IconComponent name={icon} className="h-6 w-6" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
      </div>
      {typeof change === 'number' && (
        <div className="mt-4 flex items-center">
          <IconComponent 
            name={change >= 0 ? 'arrow-up' : 'arrow-down'}
            className={`h-4 w-4 mr-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}
          />
          <span className={`text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs previous {timeRange}</span>
        </div>
      )}
    </div>
  </div>
);

StatCard.propTypes = StatCardPropTypes;

const ChartCard = ({ title, children, description }) => (
  <div className="bg-white overflow-hidden shadow-lg rounded-lg transition-all duration-200 hover:shadow-xl">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  </div>
);

ChartCard.propTypes = ChartCardPropTypes;

const TableCard = ({ title, data, columns }) => (
  <div className="bg-white overflow-hidden shadow-lg rounded-lg transition-all duration-200 hover:shadow-xl">
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={`${row.name || 'row'}-${row.id || rowIndex}`} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

TableCard.propTypes = TableCardPropTypes;

// Mock data service (replace with actual API calls)
const fetchAnalyticsData = async (startDate, endDate) => {
  // Simulate API call - In a real implementation, startDate and endDate would be used
  console.log(`Fetching data for range: ${startDate} to ${endDate}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: {
          totalAdmissions: 1250,
          readmissionRate: 15.2,
          avgLengthOfStay: 4.5,
          totalReadmissions: 190,
          predictionAccuracy: 89.5,
          admissionsChange: 5.8,
          readmissionRateChange: -2.3,
          accuracyChange: 1.2
        },
        admissionsOverTime: [
          { date: '2025-08-01', admissions: 42, readmissions: 6 },
          { date: '2025-08-15', admissions: 38, readmissions: 5 },
          { date: '2025-08-31', admissions: 45, readmissions: 7 }
        ],
        riskScoreDistribution: [
          { range: 'Low Risk (0-20)', count: 450 },
          { range: 'Medium Risk (21-40)', count: 350 },
          { range: 'High Risk (41-60)', count: 280 },
          { range: 'Very High Risk (61-80)', count: 120 },
          { range: 'Critical Risk (81-100)', count: 50 }
        ],
        departments: [
          { name: 'Cardiology', cases: 320, readmissionRate: 12.5, avgLOS: 5.2 },
          { name: 'Neurology', cases: 280, readmissionRate: 15.8, avgLOS: 4.8 },
          { name: 'Oncology', cases: 250, readmissionRate: 18.2, avgLOS: 6.1 },
          { name: 'Orthopedics', cases: 200, readmissionRate: 8.9, avgLOS: 3.9 }
        ],
        accuracyTrends: [
          { date: '2025-08-01', accuracy: 87.5 },
          { date: '2025-08-15', accuracy: 88.2 },
          { date: '2025-08-31', accuracy: 89.5 }
        ]
      });
    }, 1000);
  });
};

// Main Analytics Component
const Analytics = () => {
  // State
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [pendingRange, setPendingRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchAnalyticsData(dateRange.startDate, dateRange.endDate);
        setData(result);
        setError(null);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange.startDate, dateRange.endDate]);

  // Sync timeRange changes to both applied and pending date ranges
  useEffect(() => {
    const selected = TIME_RANGES.find(r => r.value === timeRange);
    if (selected) {
      const end = new Date();
      const start = subDays(end, selected.days);
      const newRange = {
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd')
      };
      setDateRange(newRange);
      setPendingRange(newRange);
    }
  }, [timeRange]);

  // (Replaced by pending range handlers below)

  // Handle pending (unapplied) range changes
  const handlePendingRangeChange = (startDate, endDate) => {
    setPendingRange(prev => ({
      startDate: startDate ?? prev.startDate,
      endDate: endDate ?? prev.endDate
    }));
  };

  const applyPendingRange = () => {
    setDateRange({ ...pendingRange });
  };

  const resetRange = () => {
    const end = new Date();
    const start = subDays(end, 30);
    const reset = {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd')
    };
    setTimeRange('30d');
    setPendingRange(reset);
    setDateRange(reset);
  };

  // Generate PDF report
  const generateReport = async () => {
    if (!data) return;

    setIsGeneratingReport(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text('Analytics Report', 20, 20);
      
      // Date Range
      doc.setFontSize(12);
      doc.setTextColor(52, 73, 94);
      doc.text(`Period: ${dateRange.startDate} to ${dateRange.endDate}`, 20, 30);

      // Build report by active tab
      const sectionTitle = (title) => {
        const y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 45;
        doc.setFontSize(16);
        doc.text(title, 20, y);
        return y;
      };

      const table = (head, body) => {
        const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 25 : 50;
        autoTable(doc, {
          startY,
          head: [head],
          body,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 5 },
          headStyles: { fillColor: [96, 165, 250], textColor: 255 }
        });
      };

      if (activeTab === 'overview') {
        sectionTitle('Summary Statistics');
        table(
          ['Metric', 'Value', 'Change'],
          [
            ['Total Admissions', data.summary.totalAdmissions.toString(), `${data.summary.admissionsChange}%`],
            ['Readmission Rate', `${data.summary.readmissionRate}%`, `${data.summary.readmissionRateChange}%`],
            ['Avg Length of Stay', `${data.summary.avgLengthOfStay} days`, ''],
            ['Prediction Accuracy', `${data.summary.predictionAccuracy}%`, `${data.summary.accuracyChange}%`]
          ]
        );

        if (data.admissionsOverTime?.length) {
          sectionTitle('Admissions Over Time');
          table(
            ['Date', 'Admissions', 'Readmissions'],
            data.admissionsOverTime.map(d => [d.date, d.admissions, d.readmissions])
          );
        }

        if (data.riskScoreDistribution?.length) {
          sectionTitle('Risk Score Distribution');
          table(
            ['Risk Level', 'Patient Count', 'Percentage'],
            data.riskScoreDistribution.map(risk => [
              risk.range,
              risk.count,
              `${((risk.count / data.summary.totalAdmissions) * 100).toFixed(1)}%`
            ])
          );
        }

        if (data.departments?.length) {
          sectionTitle('Department Performance');
          table(
            ['Department', 'Cases', 'Readmission Rate', 'Avg LOS'],
            data.departments.map(dept => [
              dept.name,
              dept.cases,
              `${dept.readmissionRate}%`,
              `${dept.avgLOS} days`
            ])
          );
        }
      } else if (activeTab === 'readmissions') {
        sectionTitle('Readmissions Over Time');
        table(
          ['Date', 'Readmissions'],
          (data.admissionsOverTime || []).map(d => [d.date, d.readmissions])
        );

        sectionTitle('Readmission Rate by Department');
        table(
          ['Department', 'Readmission Rate (%)'],
          ([...(data.departments || [])].sort((a, b) => b.readmissionRate - a.readmissionRate))
            .map(d => [d.name, d.readmissionRate])
        );

        sectionTitle('Readmissions by Department (Estimated)');
        table(
          ['Department', 'Total Cases', 'Readmissions (est.)', 'Readmission Rate (%)'],
          (data.departments || []).map(d => [
            d.name,
            d.cases,
            Math.round((d.cases * d.readmissionRate) / 100),
            d.readmissionRate
          ])
        );
      } else if (activeTab === 'departments') {
        sectionTitle('Department Details');
        table(
          ['Department', 'Total Cases', 'Avg LOS (days)', 'Readmission Rate (%)'],
          (data.departments || []).map(d => [d.name, d.cases, d.avgLOS, d.readmissionRate])
        );

        if (data.departments?.length) {
          const total = data.departments.reduce((sum, d) => sum + d.cases, 0);
          sectionTitle('Department Case Distribution');
          table(
            ['Department', 'Cases', 'Share'],
            data.departments.map(d => [d.name, d.cases, `${((d.cases / total) * 100).toFixed(1)}%`])
          );
        }
      }

      // Save the PDF at the end
      doc.save(`analytics-report-${activeTab}-${dateRange.startDate}-to-${dateRange.endDate}.pdf`);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center text-red-500 mb-4">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold">Error Loading Data</h2>
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Analytics Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive analytics and reporting for patient care metrics
            </p>
          </div>
          
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={generateReport}
              disabled={isGeneratingReport}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isGeneratingReport ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Report...
                </>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 relative group">
              <label 
                htmlFor="start-date" 
                className={`absolute left-3 transition-all duration-200 transform 
                  ${pendingRange.startDate ? '-translate-y-6 scale-75' : 'translate-y-3'}
                  text-1xl font-medium ${pendingRange.startDate ? 'text-gray-800' : 'text-gray-500'} group-hover:text-indigo-600`}
              >
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={pendingRange.startDate}
                onChange={(e) => handlePendingRangeChange(e.target.value, null)}
                className="peer pt-5 pb-5 block w-full rounded-lg border bg-white/50 px-3 text-gray-900 text-sm
                  focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:border-indigo-600
                  border-gray-200 shadow-sm transition-all duration-200 h-10
                  hover:border-indigo-500 hover:bg-white focus:bg-white"
                placeholder=" "
              />
              <div className="absolute inset-0 -z-10 rounded-lg transition group-hover:bg-indigo-50/50"></div>
            </div>
            <div className="lg:col-span-4 relative group">
              <label 
                htmlFor="end-date" 
                className={`absolute left-3 transition-all duration-200 transform 
                  ${pendingRange.endDate ? '-translate-y-6 scale-75' : 'translate-y-3'}
                  text-1xl font-medium ${pendingRange.endDate ? 'text-gray-800' : 'text-gray-500'} group-hover:text-indigo-600`}
              >
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                value={pendingRange.endDate}
                onChange={(e) => handlePendingRangeChange(null, e.target.value)}
                className="peer pt-5 pb-5 block w-full rounded-lg border bg-white/50 px-3 text-gray-900 text-sm
                  focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:border-indigo-600
                  border-gray-200 shadow-sm transition-all duration-200 h-10
                  hover:border-indigo-500 hover:bg-white focus:bg-white"
                placeholder=" "
              />
              <div className="absolute inset-0 -z-10 rounded-lg transition group-hover:bg-indigo-50/50"></div>
            </div>
            
      <div className="lg:col-span-4 flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
              <button
                onClick={applyPendingRange}
        className="w-full sm:w-auto h-10 inline-flex items-center justify-center px-4 border border-transparent rounded-lg 
                  shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                  disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors duration-200"
                disabled={
                  !pendingRange?.startDate ||
                  !pendingRange?.endDate ||
                  (pendingRange.startDate && pendingRange.endDate && 
                    isAfter(parseISO(pendingRange.startDate), parseISO(pendingRange.endDate))) ||
                  (pendingRange.startDate === dateRange.startDate && pendingRange.endDate === dateRange.endDate)
                }
              >
                Apply
              </button>
              <button
                onClick={resetRange}
  className="w-full sm:w-auto h-10 inline-flex items-center justify-center px-4 border rounded-lg 
                  shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                  transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
    <div className="flex flex-wrap items-center gap-2">
              {TIME_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
      className={`px-3 py-1 rounded-md text-sm border transition ${
                    timeRange === range.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Showing:</span>{' '}
              {format(parseISO(dateRange.startDate), 'MMM d, yyyy')} - {format(parseISO(dateRange.endDate), 'MMM d, yyyy')} ({
                differenceInCalendarDays(parseISO(dateRange.endDate), parseISO(dateRange.startDate)) + 1
              } days)
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          {/* Mobile: horizontally scrollable tab bar */}
          <div className="sm:hidden -mx-4 px-4">
            <nav className="flex space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300" aria-label="Tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium border transition ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent name={tab.icon} className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
          {/* Desktop */}
          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-3 font-medium text-sm rounded-lg transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent name={tab.icon} className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.description && (
                    <p className={`mt-1 text-xs ${
                      activeTab === tab.id ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      {tab.description}
                    </p>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Admissions"
              value={data?.summary.totalAdmissions}
              change={data?.summary.admissionsChange}
              timeRange={timeRange}
              icon="chart-bar"
            />
            <StatCard
              title="Readmission Rate"
              value={`${data?.summary.readmissionRate}%`}
              change={data?.summary.readmissionRateChange}
              timeRange={timeRange}
              icon="refresh"
            />
            <StatCard
              title="Prediction Accuracy"
              value={`${data?.summary.predictionAccuracy}%`}
              change={data?.summary.accuracyChange}
              timeRange={timeRange}
              icon="chart-line"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="Admissions Over Time"
              description="Daily admission and readmission trends"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.admissionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="admissions" fill={CHART_COLORS.primary} name="Admissions" />
                    <Bar dataKey="readmissions" fill={CHART_COLORS.danger} name="Readmissions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Risk Score Distribution"
              description="Patient risk level breakdown"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.riskScoreDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      nameKey="range"
                      label
                    >
                      {data?.riskScoreDistribution.map((entry, index) => (
                        <Cell
                          key={`${entry.range || 'cell'}-${entry.count || index}`}
                          fill={Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Department Table */}
          <TableCard
            title="Department Performance"
            columns={[
              { key: 'name', label: 'Department' },
              { key: 'cases', label: 'Total Cases' },
              { key: 'readmissionRate', label: 'Readmission Rate' },
              { key: 'avgLOS', label: 'Avg Length of Stay' }
            ]}
            data={data?.departments || []}
          />
          </>
          )}
          {activeTab === 'readmissions' && (
            <>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard title="Readmissions Over Time" description="Trend of readmissions across the selected period">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data?.admissionsOverTime || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="readmissions" fill={CHART_COLORS.danger} name="Readmissions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard title="Readmission Rate by Department" description="Departments sorted by readmission rate">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[...(data?.departments || [])].sort((a, b) => b.readmissionRate - a.readmissionRate)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="readmissionRate" fill={CHART_COLORS.warning} name="Readmission Rate (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>

              <TableCard
                title="Readmissions by Department"
                columns={[
                  { key: 'name', label: 'Department' },
                  { key: 'cases', label: 'Total Cases' },
                  { key: 'readmissions', label: 'Readmissions (est.)' },
                  { key: 'readmissionRate', label: 'Readmission Rate (%)' }
                ]}
                data={(data?.departments || []).map(d => ({
                  name: d.name,
                  cases: d.cases,
                  readmissions: Math.round((d.cases * d.readmissionRate) / 100),
                  readmissionRate: d.readmissionRate
                }))}
              />
            </>
          )}
          {activeTab === 'departments' && (
            <>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard title="Cases vs Avg LOS by Department" description="Comparative view using dual axes">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data?.departments || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="cases" fill={CHART_COLORS.primary} name="Cases" />
                        <Bar yAxisId="right" dataKey="avgLOS" fill={CHART_COLORS.warning} name="Avg LOS (days)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard title="Department Case Distribution" description="Share of total cases by department">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={(data?.departments || []).map(d => ({ name: d.name, value: d.cases }))} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label>
                          {(data?.departments || []).map((entry, index) => (
                            <Cell key={`${entry.name}-slice`} fill={Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>

              <TableCard
                title="Department Details"
                columns={[
                  { key: 'name', label: 'Department' },
                  { key: 'cases', label: 'Total Cases' },
                  { key: 'avgLOS', label: 'Avg Length of Stay' },
                  { key: 'readmissionRate', label: 'Readmission Rate (%)' }
                ]}
                data={data?.departments || []}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
