import { useState } from 'react';
import PropTypes from 'prop-types';

export default function RoleSelection({ onSelectRole }) {
  const [hoveredRole, setHoveredRole] = useState(null);

  // Role definitions with icons, descriptions, and styles
  const roles = [
    {
      id: 'doctor_admin',
      title: 'Doctor Admin',
      description: 'Manage clinical staff, review cases, and oversee medical protocols',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6M12 9v6" />
        </svg>
      ),
      iconBgClass: 'bg-blue-100',
      iconColor: 'text-blue-700',
      hoverClass: 'hover:border-blue-500 hover:shadow-blue-100',
      activeClass: 'border-blue-500 ring-4 ring-blue-100',
      features: ['Staff Management', 'Clinical Oversight', 'Protocol Review']
    },
    {
      id: 'nurse_admin',
      title: 'Nurse Admin',
      description: 'Coordinate nursing schedules, patient care, and manage department resources',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m0-15l-3 3m3-3l3 3" />
        </svg>
      ),
      iconBgClass: 'bg-green-100',
      iconColor: 'text-green-700',
      hoverClass: 'hover:border-green-500 hover:shadow-green-100',
      activeClass: 'border-green-500 ring-4 ring-green-100',
      features: ['Staff Scheduling', 'Resource Management', 'Care Coordination']
    },
    {
      id: 'qa_admin',
      title: 'QA Admin',
      description: 'Design and run test plans, validate system functionality, and ensure quality standards',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      iconBgClass: 'bg-purple-100',
      iconColor: 'text-purple-700',
      hoverClass: 'hover:border-purple-500 hover:shadow-purple-100',
      activeClass: 'border-purple-500 ring-4 ring-purple-100',
      features: ['Test Planning', 'Quality Assurance', 'System Validation']
    },
    {
      id: 'system_admin',
      title: 'System Admin',
      description: 'Configure system settings, manage users and permissions, and monitor platform health',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      iconBgClass: 'bg-amber-100',
      iconColor: 'text-amber-700',
      hoverClass: 'hover:border-amber-500 hover:shadow-amber-100',
      activeClass: 'border-amber-500 ring-4 ring-amber-100',
      features: ['User Management', 'System Configuration', 'Security Administration']
    }
  ];

  const handleSelectRole = (roleId) => {
    onSelectRole(roleId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Select Your Role</h2>
        <p className="mt-2 text-sm text-gray-500">
          Choose the role that best describes your responsibilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`relative bg-white border-2 rounded-lg p-6 transition-all duration-200 cursor-pointer ${
              hoveredRole === role.id ? role.hoverClass : 'border-gray-200'
            }`}
            onMouseEnter={() => setHoveredRole(role.id)}
            onMouseLeave={() => setHoveredRole(null)}
            onClick={() => handleSelectRole(role.id)}
          >
            <div className="flex space-x-4 items-start">
              <div className={`p-3 rounded-full ${role.iconBgClass}`}>
                <div className={role.iconColor}>{role.icon}</div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                
                <div className="mt-4">
                  <ul className="space-y-1">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4">
              <button className={`p-1.5 rounded-full bg-white border ${hoveredRole === role.id ? 'border-gray-800' : 'border-gray-300'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          Don't see your role? Contact system administrator for assistance
        </p>
      </div>
    </div>
  );
}

RoleSelection.propTypes = {
  onSelectRole: PropTypes.func.isRequired
};
