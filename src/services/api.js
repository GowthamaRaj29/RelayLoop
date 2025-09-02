// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:3002/api/v1';

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Patient API functions
export const patientAPI = {
  // Get all patients
  async getPatients(department, search, limit = 50, offset = 0) {
    const params = new URLSearchParams();
    if (department) params.append('department', department);
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/patients?${queryString}` : '/patients';
    
    return await apiRequest(endpoint);
  },

  // Get patient by ID
  async getPatient(id) {
    return await apiRequest(`/patients/${id}`);
  },

  // Create new patient
  async createPatient(patientData) {
    return await apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },

  // Update patient
  async updatePatient(id, patientData) {
    return await apiRequest(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patientData),
    });
  },

  // Delete patient
  async deletePatient(id) {
    return await apiRequest(`/patients/${id}`, {
      method: 'DELETE',
    });
  },

  // Add medication to patient
  async addMedication(patientId, medicationData) {
    return await apiRequest(`/patients/${patientId}/medications`, {
      method: 'POST',
      body: JSON.stringify(medicationData),
    });
  },

  // Add note to patient
  async addNote(patientId, noteData) {
    return await apiRequest(`/patients/${patientId}/notes`, {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  },

  // Get patient stats
  async getPatientStats(department) {
    const params = department ? `?department=${department}` : '';
    return await apiRequest(`/patients/stats${params}`);
  },
};

// Vital Signs API functions
export const vitalSignsAPI = {
  // Create vital signs
  async createVitalSigns(vitalSignsData) {
    return await apiRequest('/vital-signs', {
      method: 'POST',
      body: JSON.stringify(vitalSignsData),
    });
  },

  // Get vital signs by patient
  async getByPatient(patientId, limit = 50, offset = 0) {
    return await apiRequest(`/vital-signs/patient/${patientId}?limit=${limit}&offset=${offset}`);
  },

  // Get latest vital signs for patient
  async getLatest(patientId) {
    return await apiRequest(`/vital-signs/patient/${patientId}/latest`);
  },

  // Get vital signs by ID
  async getVitalSign(id) {
    return await apiRequest(`/vital-signs/${id}`);
  },

  // Update vital signs
  async updateVitalSigns(id, vitalSignsData) {
    return await apiRequest(`/vital-signs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(vitalSignsData),
    });
  },

  // Delete vital signs
  async deleteVitalSigns(id) {
    return await apiRequest(`/vital-signs/${id}`, {
      method: 'DELETE',
    });
  },

  // Get vital signs stats
  async getStats(department) {
    const params = department ? `?department=${department}` : '';
    return await apiRequest(`/vital-signs/stats${params}`);
  },
};

// Department API functions
export const departmentAPI = {
  // Get all departments
  async getDepartments() {
    return await apiRequest('/departments');
  },

  // Get department stats
  async getStats() {
    return await apiRequest('/departments/stats');
  },

  // Get specific department stats
  async getDepartmentStats(id) {
    return await apiRequest(`/departments/${id}/stats`);
  },
};

// User API functions
export const userAPI = {
  // Get user stats
  async getStats() {
    return await apiRequest('/users/stats');
  },
};

// Auth API functions
export const authAPI = {
  // Get user profile
  async getProfile() {
    return await apiRequest('/auth/profile');
  },

  // Validate token
  async validate() {
    return await apiRequest('/auth/validate');
  },
};

// Health check
export const healthAPI = {
  async check() {
    return await apiRequest('/health');
  },
};

// Export all APIs
export default {
  patient: patientAPI,
  vitalSigns: vitalSignsAPI,
  department: departmentAPI,
  user: userAPI,
  auth: authAPI,
  health: healthAPI,
};