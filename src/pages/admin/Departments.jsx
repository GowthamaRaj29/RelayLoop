import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      head: '',
      description: '',
      location: '',
      doctorsCount: 0,
      nursesCount: 0
    }
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockDepartments = [
          {
            id: 1,
            name: 'Cardiology',
            head: 'Dr. Jane Smith',
            description: 'Specialized cardiac care unit with state-of-the-art facilities',
            doctorsCount: 10,
            nursesCount: 20,
            location: 'Floor 2, West Wing'
          },
          {
            id: 2,
            name: 'Pediatrics',
            head: 'Dr. Sarah Wilson',
            description: 'Child-focused healthcare with specialized pediatric facilities',
            doctorsCount: 12,
            nursesCount: 25,
            location: 'Floor 1, North Wing'
          }
        ];
        setDepartments(mockDepartments);
      } catch (_err) {
        setError('Failed to fetch departments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleAddDepartment = (data) => {
    const newDepartment = {
      id: departments.length + 1,
      ...data
    };
    setDepartments([...departments, newDepartment]);
    setShowAddModal(false);
    reset();
  };

  const handleEditDepartment = (data) => {
    const updatedDepartments = departments.map(dept => 
      dept.id === selectedDepartment.id ? { ...dept, ...data } : dept
    );
    setDepartments(updatedDepartments);
    setShowEditModal(false);
    setSelectedDepartment(null);
    reset();
  };

  const handleDeleteDepartment = (id) => {
    const updatedDepartments = departments.filter(dept => dept.id !== id);
    setDepartments(updatedDepartments);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading departments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-colors"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 flex-shrink-0" />
              <span>Add Department</span>
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredDepartments.map(dept => (
              <div 
                key={dept.id} 
                className="group bg-white shadow-sm hover:shadow-lg transition-all duration-200 rounded-xl overflow-hidden flex flex-col border border-gray-200 hover:border-gray-300"
              >
                <div className="px-4 py-4 sm:p-6 flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {dept.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">{dept.head}</p>
                    </div>
                    <div className="flex gap-3 sm:ml-4 flex-shrink-0">
                      <button 
                        onClick={() => {
                          setSelectedDepartment(dept);
                          setShowEditModal(true);
                          reset(dept);
                        }}
                        className="p-2 sm:p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-gray-50 transition-colors"
                        aria-label="Edit department"
                      >
                        <PencilSquareIcon className="h-6 w-6 sm:h-5 sm:w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="p-2 sm:p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-50 transition-colors"
                        aria-label="Delete department"
                      >
                        <TrashIcon className="h-6 w-6 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 text-base sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-2">
                    {dept.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <div className="flex items-center text-gray-700 flex-shrink-0">
                        <UserGroupIcon className="h-5 w-5 mr-3 flex-shrink-0 text-gray-400" />
                        <span className="text-sm">
                          {dept.doctorsCount} {dept.doctorsCount === 1 ? 'Doctor' : 'Doctors'}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700 flex-shrink-0 ml-8 sm:ml-0">
                        <UserGroupIcon className="h-5 w-5 mr-3 flex-shrink-0 text-gray-400" />
                        <span className="text-sm">
                          {dept.nursesCount} {dept.nursesCount === 1 ? 'Nurse' : 'Nurses'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-3 flex-shrink-0 text-gray-400" />
                      <span className="text-sm">{dept.location}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedDepartment(dept);
                    setShowDetailsModal(true);
                  }}
                  className="w-full px-5 py-3 text-sm text-indigo-600 hover:bg-indigo-50 border-t border-gray-100 transition-colors text-center font-medium"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog 
        open={showAddModal || showEditModal} 
        onClose={() => {
          showAddModal ? setShowAddModal(false) : setShowEditModal(false);
          reset();
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden max-h-[95vh] flex flex-col relative">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-lg font-semibold text-gray-900">
                  {showAddModal ? 'Add Department' : 'Edit Department'}
                </h3>
                <button
                  onClick={() => {
                    showAddModal ? setShowAddModal(false) : setShowEditModal(false);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-500 p-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(showAddModal ? handleAddDepartment : handleEditDepartment)} className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Department Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Department name is required' })}
                    className="block w-full px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    placeholder="Enter department name"
                  />
                  {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Department Head</label>
                  <input
                    type="text"
                    {...register('head', { required: 'Department head is required' })}
                    className="block w-full px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    placeholder="Enter department head name"
                  />
                  {errors.head && <p className="mt-1.5 text-sm text-red-600">{errors.head.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={3}
                    className="block w-full px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm resize-none"
                    placeholder="Enter department description"
                  />
                  {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Number of Doctors</label>
                    <input
                      type="number"
                      {...register('doctorsCount', { 
                        required: 'Required',
                        min: { value: 0, message: 'Must be 0 or greater' }
                      })}
                      className="block w-full px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                      placeholder="0"
                    />
                    {errors.doctorsCount && <p className="mt-1.5 text-sm text-red-600">{errors.doctorsCount.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Number of Nurses</label>
                    <input
                      type="number"
                      {...register('nursesCount', { 
                        required: 'Required',
                        min: { value: 0, message: 'Must be 0 or greater' }
                      })}
                      className="block w-full px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                      placeholder="0"
                    />
                    {errors.nursesCount && <p className="mt-1.5 text-sm text-red-600">{errors.nursesCount.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    {...register('location', { required: 'Location is required' })}
                    className="block w-full px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    placeholder="Enter department location"
                  />
                  {errors.location && <p className="mt-1.5 text-sm text-red-600">{errors.location.message}</p>}
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      showAddModal ? setShowAddModal(false) : setShowEditModal(false);
                      reset();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg border border-gray-300 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg shadow-sm"
                  >
                    {showAddModal ? 'Add Department' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onClose={() => setShowDetailsModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedDepartment?.name}</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full p-1"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <dl className="space-y-6">
                <div>
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <BuildingOfficeIcon className="h-5 w-5 mr-3 text-gray-400" />
                    Department Head
                  </dt>
                  <dd className="mt-1 text-base text-gray-900 ml-8">{selectedDepartment?.head}</dd>
                </div>

                <div>
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Description
                  </dt>
                  <dd className="mt-1 text-base text-gray-900 ml-8">{selectedDepartment?.description}</dd>
                </div>

                <div>
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <UserGroupIcon className="h-5 w-5 mr-3 text-gray-400" />
                    Staff Count
                  </dt>
                  <dd className="mt-2 grid grid-cols-2 gap-4 ml-8">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Doctors</p>
                      <p className="text-2xl font-semibold text-gray-900">{selectedDepartment?.doctorsCount}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Nurses</p>
                      <p className="text-2xl font-semibold text-gray-900">{selectedDepartment?.nursesCount}</p>
                    </div>
                  </dd>
                </div>

                <div>
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                    Location
                  </dt>
                  <dd className="mt-1 text-base text-gray-900 ml-8">{selectedDepartment?.location}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg border border-gray-300 shadow-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDepartment(selectedDepartment);
                  setShowEditModal(true);
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg shadow-sm"
              >
                Edit Department
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
