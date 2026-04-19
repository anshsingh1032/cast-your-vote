import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom'; 

export default function Login() {
  const [aadhaarCardNumber, setAadhaar] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ aadhaarCardNumber, password })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard');
      }
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 py-10">
        <div className='absolute inset-0'>
            <img src="bg.avif" alt="" className='w-full h-full object-cover'/>
        </div>
      <form onSubmit={handleSubmit} className="bg-[#fff0f3] backdrop-blur-lg p-8 rounded-lg shadow-md w-full max-w-md z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to cast your vote</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Aadhaar Card Number</label>
          <input 
            type="number" 
            className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            value={aadhaarCardNumber} 
            onChange={(e) => setAadhaar(e.target.value)} 
            placeholder="Enter your 12-digit Aadhaar"
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
          <input 
            type="password" 
            className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password"
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#ff4d6d] text-white font-semibold py-2.5 rounded hover:bg-[#c9184a] disabled:opacity-50 transition-colors shadow-sm"
        >
          {isLoading ? 'Authenticating...' : 'Login'}
        </button>


        <div className="mt-6 text-center text-sm text-gray-600 border-t pt-4">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#ff4d6d] hover:text-[#c9184a] font-semibold hover:underline">
              Create one here
            </Link>
          </p>
        </div>

      </form>
    </div>
  );
}