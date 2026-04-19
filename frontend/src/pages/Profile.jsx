import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, resetPasswordStatus } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, passwordChangeSuccess } = useSelector((state) => state.auth);

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [localError, setLocalError] = useState('');


  useEffect(() => {
    return () => dispatch(resetPasswordStatus());
  }, [dispatch]);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setLocalError("New passwords do not match!");
      return;
    }

    dispatch(changePassword({
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setPasswords({ oldPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear form
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f3d5b5] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <button onClick={() => navigate('/dashboard')} className=" text-dark-emerald font-bold hover:underline">
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Details Card */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-700">Account Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Full Name</p>
                <p className="text-lg text-gray-800">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Aadhaar Card Number</p>
                <p className="text-lg text-gray-800">{user?.aadhaarCardNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Age</p>
                <p className="text-lg text-gray-800">{user?.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Address</p>
                <p className="text-lg text-gray-800">{user?.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Role & Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 mr-2 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {user?.role.toUpperCase()}
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${user?.isVoted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {user?.isVoted ? 'Voted' : 'Not Voted'}
                </span>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-700">Change Password</h2>
            
            {localError && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{localError}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
            {passwordChangeSuccess && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">Password updated successfully!</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Current Password</label>
                <input 
                  type="password" 
                  name="oldPassword" 
                  placeholder='Enter your current password'
                  value={passwords.oldPassword} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  placeholder='Enter your new password'
                  value={passwords.newPassword} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  required 
                  minLength="6"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-gray-700">Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmNewPassword" 
                  placeholder='Confirm your new password'
                  value={passwords.confirmNewPassword} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  required 
                  minLength="6"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-dark-emerald  hover:bg-sea-green text-[#f3d5b5] font-semibold py-2 rounded  disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}