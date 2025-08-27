import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function SystemSettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    general: {
      systemName: 'RelayLoop',
      hospitalName: 'City General Hospital',
      supportEmail: 'support@relayloop.com',
      notificationsEnabled: true,
    },
    security: {
      sessionTimeout: 30,
      requireMFA: true,
      passwordExpiry: 90,
      loginAttempts: 5,
    },
    prediction: {
      thresholdHigh: 0.75,
      thresholdMedium: 0.5,
      modelVersion: 'v2.1.0',
      updateFrequency: 'daily',
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      highRiskAlert: true,
      dailyReportTime: '08:00',
    },
  });
  
  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setSaveSuccess(false);
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // In a real app, save to database
      // await supabase.from('system_settings').upsert({
      //   settings: settings,
      //   updated_by: user.id,
      //   updated_at: new Date()
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
              ${isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
        
        {saveSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-md text-green-700">
            Settings saved successfully!
          </div>
        )}
        
        <div className="mt-6 space-y-8">
          {/* General Settings */}
          <SettingsSection title="General Settings">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="systemName" className="block text-sm font-medium text-gray-700">
                  System Name
                </label>
                <input
                  type="text"
                  id="systemName"
                  value={settings.general.systemName}
                  onChange={(e) => handleChange('general', 'systemName', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">
                  Hospital Name
                </label>
                <input
                  type="text"
                  id="hospitalName"
                  value={settings.general.hospitalName}
                  onChange={(e) => handleChange('general', 'hospitalName', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">
                  Support Email
                </label>
                <input
                  type="email"
                  id="supportEmail"
                  value={settings.general.supportEmail}
                  onChange={(e) => handleChange('general', 'supportEmail', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="flex items-center h-full">
                <div className="flex items-start mt-5">
                  <div className="flex items-center h-5">
                    <input
                      id="notificationsEnabled"
                      type="checkbox"
                      checked={settings.general.notificationsEnabled}
                      onChange={(e) => handleChange('general', 'notificationsEnabled', e.target.checked)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notificationsEnabled" className="font-medium text-gray-700">
                      Enable System Notifications
                    </label>
                    <p className="text-gray-500">Allows system to send notifications to users</p>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>
          
          {/* Security Settings */}
          <SettingsSection title="Security Settings">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  id="sessionTimeout"
                  min="5"
                  max="120"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700">
                  Password Expiry (days)
                </label>
                <input
                  type="number"
                  id="passwordExpiry"
                  min="30"
                  max="365"
                  value={settings.security.passwordExpiry}
                  onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="loginAttempts" className="block text-sm font-medium text-gray-700">
                  Max Failed Login Attempts
                </label>
                <input
                  type="number"
                  id="loginAttempts"
                  min="3"
                  max="10"
                  value={settings.security.loginAttempts}
                  onChange={(e) => handleChange('security', 'loginAttempts', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="flex items-center h-full">
                <div className="flex items-start mt-5">
                  <div className="flex items-center h-5">
                    <input
                      id="requireMFA"
                      type="checkbox"
                      checked={settings.security.requireMFA}
                      onChange={(e) => handleChange('security', 'requireMFA', e.target.checked)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="requireMFA" className="font-medium text-gray-700">
                      Require Multi-Factor Authentication
                    </label>
                    <p className="text-gray-500">Requires all users to set up MFA</p>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>
          
          {/* Prediction Model Settings */}
          <SettingsSection title="Prediction Model Settings">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="thresholdHigh" className="block text-sm font-medium text-gray-700">
                  High Risk Threshold
                </label>
                <input
                  type="number"
                  id="thresholdHigh"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.prediction.thresholdHigh}
                  onChange={(e) => handleChange('prediction', 'thresholdHigh', parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">Probability threshold for high risk classification (0-1)</p>
              </div>
              
              <div>
                <label htmlFor="thresholdMedium" className="block text-sm font-medium text-gray-700">
                  Medium Risk Threshold
                </label>
                <input
                  type="number"
                  id="thresholdMedium"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.prediction.thresholdMedium}
                  onChange={(e) => handleChange('prediction', 'thresholdMedium', parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">Probability threshold for medium risk classification (0-1)</p>
              </div>
              
              <div>
                <label htmlFor="modelVersion" className="block text-sm font-medium text-gray-700">
                  Model Version
                </label>
                <select
                  id="modelVersion"
                  value={settings.prediction.modelVersion}
                  onChange={(e) => handleChange('prediction', 'modelVersion', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="v1.0.0">v1.0.0 (Legacy)</option>
                  <option value="v2.0.0">v2.0.0</option>
                  <option value="v2.1.0">v2.1.0 (Recommended)</option>
                  <option value="v3.0.0-beta">v3.0.0 (Beta)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="updateFrequency" className="block text-sm font-medium text-gray-700">
                  Prediction Update Frequency
                </label>
                <select
                  id="updateFrequency"
                  value={settings.prediction.updateFrequency}
                  onChange={(e) => handleChange('prediction', 'updateFrequency', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          </SettingsSection>
          
          {/* Notification Settings */}
          <SettingsSection title="Notification Settings">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="emailEnabled"
                    type="checkbox"
                    checked={settings.notifications.emailEnabled}
                    onChange={(e) => handleChange('notifications', 'emailEnabled', e.target.checked)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="emailEnabled" className="font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p className="text-gray-500">Send notifications via email</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="smsEnabled"
                    type="checkbox"
                    checked={settings.notifications.smsEnabled}
                    onChange={(e) => handleChange('notifications', 'smsEnabled', e.target.checked)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="smsEnabled" className="font-medium text-gray-700">
                    SMS Notifications
                  </label>
                  <p className="text-gray-500">Send notifications via SMS</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="pushEnabled"
                    type="checkbox"
                    checked={settings.notifications.pushEnabled}
                    onChange={(e) => handleChange('notifications', 'pushEnabled', e.target.checked)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="pushEnabled" className="font-medium text-gray-700">
                    Push Notifications
                  </label>
                  <p className="text-gray-500">Send in-app push notifications</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="highRiskAlert"
                    type="checkbox"
                    checked={settings.notifications.highRiskAlert}
                    onChange={(e) => handleChange('notifications', 'highRiskAlert', e.target.checked)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="highRiskAlert" className="font-medium text-gray-700">
                    High Risk Patient Alerts
                  </label>
                  <p className="text-gray-500">Send immediate alerts for high risk patients</p>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="dailyReportTime" className="block text-sm font-medium text-gray-700">
                  Daily Report Time
                </label>
                <input
                  type="time"
                  id="dailyReportTime"
                  value={settings.notifications.dailyReportTime}
                  onChange={(e) => handleChange('notifications', 'dailyReportTime', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">Time for sending daily summary reports</p>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div className="shadow sm:rounded-md sm:overflow-hidden">
      <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}
