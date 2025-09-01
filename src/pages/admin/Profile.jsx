import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';

export default function AdminProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm();
  
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // In a real app, we would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select('*')
      //   .eq('id', user.id)
      //   .single();
      
      // if (error) throw error;
      
      // Mock data for demonstration
      const mockProfile = {
        id: user?.id || '1',
        email: user?.email || 'admin@relayloop.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        phone_number: '+1 (555) 123-4567',
        department: 'IT Administration',
        created_at: '2023-01-15T10:30:00Z',
        last_sign_in: new Date().toISOString(),
        avatar_url: 'https://ui-avatars.com/api/?name=Admin+User&background=0062cc&color=fff',
        bio: 'System administrator responsible for managing user accounts, access controls, and platform configuration.',
        timezone: 'America/New_York',
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          theme: 'light',
          language: 'en-US'
        }
      };
      
      setProfile(mockProfile);
      setAvatarUrl(mockProfile.avatar_url);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);
  
  const handleUpdateProfile = async (formData) => {
    try {
      // In a real app, we would update the profile in Supabase
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({
      //     first_name: formData.first_name,
      //     last_name: formData.last_name,
      //     phone_number: formData.phone_number,
      //     department: formData.department,
      //     bio: formData.bio,
      //     timezone: formData.timezone
      //   })
      //   .eq('id', user.id);
      
      // if (error) throw error;
      
      // Update local state
      setProfile({
        ...profile,
        ...formData
      });
      
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };
  
  const handleChangePassword = async (formData) => {
    try {
      if (formData.new_password !== formData.confirm_password) {
        alert('Passwords do not match');
        return;
      }
      
      // In a real app, we would update the password in Supabase Auth
      // const { error } = await supabase.auth.updateUser({
      //   password: formData.new_password
      // });
      
      // if (error) throw error;
      
      setIsPasswordModalOpen(false);
      resetPassword();
      alert('Password updated successfully');
    } catch (err) {
      console.error('Error updating password:', err);
      alert('Failed to update password. Please try again.');
    }
  };
  
  const handleAvatarUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      
      setUploading(true);
      
      // In a real app, we would upload to Supabase Storage
      // const fileExt = file.name.split('.').pop();
      // const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      // const filePath = `avatars/${fileName}`;
      
      // const { error: uploadError } = await supabase.storage
      //   .from('user_avatars')
      //   .upload(filePath, file);
      
      // if (uploadError) throw uploadError;
      
      // Get the public URL
      // const { data } = supabase.storage.from('user_avatars').getPublicUrl(filePath);
      
      // Update profile with new avatar URL
      // await supabase
      //   .from('profiles')
      //   .update({ avatar_url: data.publicUrl })
      //   .eq('id', user.id);
      
      // For demonstration, use a data URL
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarUrl(reader.result);
        setProfile({
          ...profile,
          avatar_url: reader.result
        });
        setUploading(false);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setUploading(false);
      };
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert('Failed to upload avatar. Please try again.');
      setUploading(false);
    }
  };
  
  // Preferences feature removed: notification/theme/language update handlers deleted
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={fetchProfile}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Profile</h1>
        
        {/* Profile navigation */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Security
            </button>
          </nav>
        </div>

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and contact information.</p>
              </div>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    reset({
                      first_name: profile.first_name,
                      last_name: profile.last_name,
                      phone_number: profile.phone_number,
                      department: profile.department,
                      bio: profile.bio,
                      timezone: profile.timezone
                    });
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit(handleUpdateProfile)} className="border-t border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 h-24 w-24 relative">
                    {uploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                      </div>
                    ) : (
                      <>
                        <img 
                          className="h-24 w-24 rounded-full object-cover" 
                          src={avatarUrl || 'https://ui-avatars.com/api/?name=Admin+User&background=0062cc&color=fff'} 
                          alt="Profile avatar" 
                        />
                        <label 
                          htmlFor="avatar-upload" 
                          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleAvatarUpload} 
                          />
                        </label>
                      </>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Profile Photo</p>
                    <p className="text-sm text-gray-500">JPG, PNG, or GIF up to 5MB</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="first_name"
                      defaultValue={profile.first_name}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('first_name', { required: 'First name is required' })}
                    />
                    {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="last_name"
                      defaultValue={profile.last_name}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('last_name', { required: 'Last name is required' })}
                    />
                    {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      defaultValue={profile.email}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed. Contact support for assistance.</p>
                  </div>
                  
                  <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      id="phone_number"
                      defaultValue={profile.phone_number}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('phone_number')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                      type="text"
                      id="department"
                      defaultValue={profile.department}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('department')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                    <select
                      id="timezone"
                      defaultValue={profile.timezone}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('timezone')}
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      id="bio"
                      rows={3}
                      defaultValue={profile.bio}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('bio')}
                    />
                    <p className="mt-1 text-xs text-gray-500">Brief description for your profile.</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Avatar</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <img 
                        className="h-16 w-16 rounded-full" 
                        src={profile.avatar_url || 'https://ui-avatars.com/api/?name=Admin+User&background=0062cc&color=fff'} 
                        alt="Profile avatar" 
                      />
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.first_name} {profile.last_name}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.email}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full uppercase">{profile.role}</span>
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.phone_number || 'Not provided'}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.department}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Bio</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.bio}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Timezone</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.timezone}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Account created</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Last sign in</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {new Date(profile.last_sign_in).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Security Settings</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account security.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Password</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your password regularly to keep your account secure.</p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
                
                {/* Two-Factor Authentication section removed as requested */}
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Active Sessions</h3>
                    <p className="mt-1 text-sm text-gray-500">Manage your active login sessions.</p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sign Out All Devices
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Login History</h3>
                  <div className="bg-gray-50 rounded-md overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Session</p>
                          <p className="text-xs text-gray-500">
                            {new Date().toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Active Now</span>
                          </div>
                          <p>Windows • Chrome • New York, USA</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Previous Session</p>
                          <p className="text-xs text-gray-500">August 25, 2025, 09:41 AM</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>Windows • Chrome • New York, USA</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Previous Session</p>
                          <p className="text-xs text-gray-500">August 20, 2025, 02:15 PM</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>iOS • Safari • Boston, USA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
  {/* Preferences tab removed as requested */}
        
        {/* Password Change Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please enter your current password and a new password.
                      </p>
                    </div>
                    <form onSubmit={handlePasswordSubmit(handleChangePassword)} className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="current_password"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          {...registerPassword('current_password', { required: 'Current password is required' })}
                        />
                        {passwordErrors.current_password && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="new_password"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          {...registerPassword('new_password', { 
                            required: 'New password is required',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters'
                            }
                          })}
                        />
                        {passwordErrors.new_password && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirm_password"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          {...registerPassword('confirm_password', { 
                            required: 'Please confirm your password',
                            validate: value => value === registerPassword('new_password').value || 'Passwords do not match'
                          })}
                        />
                        {passwordErrors.confirm_password && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm_password.message}</p>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handlePasswordSubmit(handleChangePassword)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add User Management Section Link to existing User Management page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-10">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">User Management</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage users and roles in the system.</p>
            </div>
            <Link
              to="/admin/users"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to User Management
            </Link>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-500">
              As an administrator, you can create new users, edit existing users, manage roles, and perform other user management tasks from the User Management page.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create new user accounts
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Edit user information and roles
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Disable or reactivate user accounts
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Reset user passwords
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons from Heroicons (used in the component)
function PlusIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function MenuAlt2Icon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  );
}
