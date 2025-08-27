import React, { useState, useEffect } from 'react';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [filter, setFilter] = useState('');

  // Mock data for departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockDepartments = [
          { 
            id: 1, 
            name: 'Cardiology', 
            head: 'Dr. Jane Smith', 
            doctorsCount: 12, 
            patientsCount: 78,
            predictionCount: 126,
            location: 'Wing A, 3rd Floor'
          },
          { 
            id: 2, 
            name: 'Oncology', 
            head: 'Dr. Robert Johnson', 
            doctorsCount: 8, 
            patientsCount: 56,
            predictionCount: 98,
            location: 'Wing B, 2nd Floor'
          },
          { 
            id: 3, 
            name: 'Neurology', 
            head: 'Dr. Emily Chen', 
            doctorsCount: 10, 
            patientsCount: 62,
            predictionCount: 87,
            location: 'Wing A, 4th Floor'
          },
          { 
            id: 4, 
            name: 'Pediatrics', 
            head: 'Dr. Michael Brown', 
            doctorsCount: 15, 
            patientsCount: 104,
            predictionCount: 65,
            location: 'Wing C, 1st Floor'
          },
          { 
            id: 5, 
            name: 'Surgery', 
            head: 'Dr. Sarah Wilson', 
            doctorsCount: 9, 
            patientsCount: 43,
            predictionCount: 74,
            location: 'Wing B, 3rd Floor'
          },
        ];
        
        setDepartments(mockDepartments);
      } catch (err) {
        console.error('Error loading departments:', err);
        setError('Failed to load departments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleAddDepartment = () => {
    setShowAddModal(true);
  };

  const handleEditDepartment = (department) => {
    setCurrentDepartment(department);
    setShowEditModal(true);
  };

  const handleDeleteDepartment = (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(dept => dept.id !== departmentId));
    }
  };

  const filteredDepartments = departments.filter(
    dept => dept.name.toLowerCase().includes(filter.toLowerCase()) || 
           dept.head.toLowerCase().includes(filter.toLowerCase())
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Departments</h1>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/6"></div>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li key={item} className="px-6 py-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-40"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Departments</h1>
          <div className="mt-6 p-4 bg-red-50 rounded-md">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Departments</h1>
          <button
            onClick={handleAddDepartment}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Department
          </button>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative rounded-md shadow-sm w-64">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search departments..."
                className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredDepartments.length} of {departments.length} departments
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Head
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDepartments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{department.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{department.head}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-4 text-xs">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {department.doctorsCount} Doctors
                        </span>
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {department.patientsCount} Patients
                        </span>
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {department.predictionCount} Predictions
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {department.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditDepartment(department)}
                        className="text-teal-600 hover:text-teal-900 mr-4"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Department Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium mb-4">Add New Department</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Name</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Head</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                >
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal would go here */}
      {showEditModal && currentDepartment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium mb-4">Edit Department</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Name</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                  defaultValue={currentDepartment.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Head</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                  defaultValue={currentDepartment.head}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                  defaultValue={currentDepartment.location}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
