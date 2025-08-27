import { useState, useEffect } from 'react';

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // Simulating data loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Time Range:</span>
              <select
                id="time-range"
                name="time-range"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Select a tab</label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="overview">Overview</option>
              <option value="readmissions">Readmissions</option>
              <option value="predictions">Predictions</option>
              <option value="departments">Departments</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'readmissions', label: 'Readmissions' },
                  { id: 'predictions', label: 'Predictions' },
                  { id: 'departments', label: 'Departments' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewTab timeRange={timeRange} />}
              {activeTab === 'readmissions' && <ReadmissionsTab timeRange={timeRange} />}
              {activeTab === 'predictions' && <PredictionsTab timeRange={timeRange} />}
              {activeTab === 'departments' && <DepartmentsTab timeRange={timeRange} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ timeRange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Admissions" 
          value="1,284"
          change={+12.5}
          timeRange={timeRange}
        />
        <StatCard 
          title="Readmission Rate" 
          value="15.3%"
          change={-2.3}
          timeRange={timeRange}
        />
        <StatCard 
          title="Average LOS" 
          value="4.2 days"
          change={-0.5}
          timeRange={timeRange}
        />
        <StatCard 
          title="Prediction Accuracy" 
          value="87.2%"
          change={+1.7}
          timeRange={timeRange}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Admissions vs Readmissions" timeRange={timeRange} />
        <ChartCard title="Risk Score Distribution" timeRange={timeRange} />
      </div>
      
      <div className="grid grid-cols-1">
        <TableCard title="Top Readmission Diagnoses" timeRange={timeRange} />
      </div>
    </div>
  );
}

function ReadmissionsTab({ timeRange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="30-Day Readmissions" 
          value="196"
          change={-8.5}
          timeRange={timeRange}
        />
        <StatCard 
          title="7-Day Readmissions" 
          value="84"
          change={-12.3}
          timeRange={timeRange}
        />
        <StatCard 
          title="Avoidable Readmissions" 
          value="132"
          change={-15.2}
          timeRange={timeRange}
        />
      </div>
      
      <div className="grid grid-cols-1">
        <ChartCard title="Readmission Trends" timeRange={timeRange} height="md" />
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Readmission by Department" timeRange={timeRange} />
        <ChartCard title="Readmission by Age Group" timeRange={timeRange} />
      </div>
    </div>
  );
}

function PredictionsTab({ timeRange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="True Positives" 
          value="246"
          change={+5.8}
          timeRange={timeRange}
        />
        <StatCard 
          title="False Positives" 
          value="32"
          change={-12.5}
          timeRange={timeRange}
        />
        <StatCard 
          title="Model AUC" 
          value="0.89"
          change={+0.04}
          timeRange={timeRange}
        />
      </div>
      
      <div className="grid grid-cols-1">
        <ChartCard title="ROC Curve" timeRange={timeRange} height="md" />
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Feature Importance" timeRange={timeRange} />
        <ChartCard title="Risk Distribution" timeRange={timeRange} />
      </div>
    </div>
  );
}

function DepartmentsTab({ timeRange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1">
        <ChartCard title="Department Performance" timeRange={timeRange} height="md" />
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <TableCard title="Department Readmission Rates" timeRange={timeRange} />
        <ChartCard title="Department Risk Distribution" timeRange={timeRange} />
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, change, timeRange }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            {change > 0 ? (
              <ArrowUpIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-sm ml-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change)}% from previous {timeRange}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, timeRange, height = "sm" }) {
  const heightClass = height === "md" ? "h-80" : "h-64";
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {timeRange === '7d' && 'Last 7 days'}
          {timeRange === '30d' && 'Last 30 days'}
          {timeRange === '90d' && 'Last 90 days'}
          {timeRange === '1y' && 'Last year'}
        </p>
        <div className={`mt-5 ${heightClass} bg-gray-50 rounded-md flex items-center justify-center`}>
          <p className="text-gray-400">Chart Placeholder</p>
        </div>
      </div>
    </div>
  );
}

function TableCard({ title, timeRange }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {timeRange === '7d' && 'Last 7 days'}
          {timeRange === '30d' && 'Last 30 days'}
          {timeRange === '90d' && 'Last 90 days'}
          {timeRange === '1y' && 'Last year'}
        </p>
        <div className="mt-5">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Count
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { rank: 1, name: 'Congestive Heart Failure', count: 58, percent: 29.6 },
                        { rank: 2, name: 'COPD', count: 42, percent: 21.4 },
                        { rank: 3, name: 'Pneumonia', count: 36, percent: 18.4 },
                        { rank: 4, name: 'Diabetes', count: 28, percent: 14.3 },
                        { rank: 5, name: 'Sepsis', count: 22, percent: 11.2 }
                      ].map((item) => (
                        <tr key={item.rank}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.rank}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.percent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
const ArrowUpIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const ArrowDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);
