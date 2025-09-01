import { useState } from 'react';
import { format } from 'date-fns';

export default function DateRangeSelector({ onRangeChange }) {
  const [startDate, setStartDate] = useState(
    format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    onRangeChange({ startDate: start, endDate: end });
  };

  const handleQuickSelect = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    handleRangeChange(
      format(start, 'yyyy-MM-dd'),
      format(end, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex items-center space-x-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => handleRangeChange(e.target.value, endDate)}
          className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => handleRangeChange(startDate, e.target.value)}
          max={format(new Date(), 'yyyy-MM-dd')}
          className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuickSelect(7)}
          className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          7D
        </button>
        <button
          onClick={() => handleQuickSelect(30)}
          className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          30D
        </button>
        <button
          onClick={() => handleQuickSelect(90)}
          className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          90D
        </button>
      </div>
    </div>
  );
}
