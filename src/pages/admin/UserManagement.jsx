import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userAPI } from '../../services/api';

export default function UserManagement() {
  const { role } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    department: ''
  });
  
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      const response = await userAPI.getUsers(params);
      
      if (response.statusCode === 200) {
        setUsers(response.data.users || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(`Failed to load users: ${err.message}`);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await userAPI.deleteUser(userId);
      
      if (response.statusCode === 200) {
        // Refresh the user list
        await fetchUsers();
        alert('User deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(`Failed to delete user: ${err.message}`);
    }
  };
  
  const handleUserUpdate = async (updatedUser) => {
    try {
      const response = await userAPI.updateUser(updatedUser.id, updatedUser);
      
      if (response.statusCode === 200) {
        // Refresh the user list
        await fetchUsers();
        setIsModalOpen(false);
        setSelectedUser(null);
        alert('User updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert(`Failed to update user: ${err.message}`);
    }
  };
  
  const handleCreateUser = async (newUser) => {
    try {
      const response = await userAPI.createUser(newUser);
      
      if (response.statusCode === 201) {
        // Refresh the user list
        await fetchUsers();
        setIsNewUserModalOpen(false);
        alert('User created successfully');
      } else {
        throw new Error(response.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      alert(`Failed to create user: ${err.message}`);
    }
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRoleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      role: e.target.value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDepartmentFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      department: e.target.value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    if (status === 'active' || status === true) {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === 'inactive' || status === false) {
      return `${baseClasses} bg-red-100 text-red-800`;
    } else if (status === 'pending') {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else {
      return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <button
            type="button"
            onClick={() => setIsNewUserModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-md text-red-700">
            <p>{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Filters */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Users
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Role
              </label>
              <select
                id="role-filter"
                value={filters.role}
                onChange={handleRoleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
              </select>
            </div>
            <div>
              <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Department
              </label>
              <select
                id="department-filter"
                value={filters.department}
                onChange={handleDepartmentFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Oncology">Oncology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Department
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Created At
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        // Loading skeletons
                        [...Array(5)].map((_, index) => (
                          <tr key={`loading-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                                <div className="ml-4">
                                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="h-4 bg-gray-200 rounded w-16 ml-auto animate-pulse"></div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.first_name} {user.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user.email}
                                  </div>
                                  <div className="text-sm text-gray-500 md:hidden">
                                    {user.department}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="text-sm text-gray-900">{user.department}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                  user.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-green-100 text-green-800'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getStatusBadge(user.is_active !== false ? 'active' : 'inactive')}>
                                {user.is_active !== false ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                              {formatDate(user.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => handleEditUser(user)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages)].map((_, index) => {
                const pageNum = index + 1;
                const isCurrentPage = pageNum === pagination.page;
                
                // Show first page, last page, current page, and pages around current
                if (
                  pageNum === 1 ||
                  pageNum === pagination.totalPages ||
                  (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        isCurrentPage
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === pagination.page - 2 ||
                  pageNum === pagination.page + 2
                ) {
                  return (
                    <span key={pageNum} className="px-3 py-2 text-sm text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {isModalOpen && selectedUser && (
        <UserModal 
          user={selectedUser}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleUserUpdate}
        />
      )}
      
      {/* New User Modal */}
      {isNewUserModalOpen && (
        <UserModal 
          isNew={true}
          onClose={() => setIsNewUserModalOpen(false)}
          onSave={handleCreateUser}
        />
      )}
    </div>
  );
}

function UserModal({ user, isNew = false, onClose, onSave }) {
  const [formData, setFormData] = useState(
    isNew 
      ? { 
          email: '', 
          password: '',
          first_name: '', 
          last_name: '',
          department: '',
          role: 'nurse',
          phone: '',
          is_active: true
        }
      : { 
          ...user, 
          password: '' // Empty password field for editing
        }
  );
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none backdrop-blur-xs">
      <div className="bg-white rounded-xl overflow-hidden shadow-2xl transform transition-all max-w-lg w-full max-h-[95vh] pointer-events-auto">
        <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl leading-6 font-semibold text-gray-900">
            {isNew ? 'Create New User' : 'Edit User'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-200 transition-colors duration-200 focus:outline-none"
          >
            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[80vh]">
          <div className="px-6 py-6 bg-white">
            <div className="grid grid-cols-6 gap-x-4 gap-y-5">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  First name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="block w-full h-10 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter first name"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last name
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="block w-full h-10 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter last name"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isNew}
                  required
                  className="block w-full h-10 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-600"
                  placeholder="user@example.com"
                />
              </div>
              
              {isNew && (
                <div className="col-span-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={isNew}
                    className="block w-full h-10 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter Password"
                  />
                </div>
              )}

              <div className="col-span-6">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  id="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  required
                  className="block w-full h-10 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="E.g., Cardiology, Pediatrics, IT Administration"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="block w-full h-10 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full h-10 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                </select>
              </div>
              
              {!isNew && (
                <div className="col-span-6">
                  <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  <select
                    id="is_active"
                    name="is_active"
                    value={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                    className="block w-full h-10 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-4 sm:w-auto sm:text-sm transition-colors duration-200"
            >
              {isNew ? 'Create' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);
