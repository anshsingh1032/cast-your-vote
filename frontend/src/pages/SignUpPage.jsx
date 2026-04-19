import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    aadhaarCardNumber: '',
    password: '',
    email: '', 
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, age: Number(formData.age) };
    
    dispatch(registerUser(dataToSubmit)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard');
      }
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 py-10 ">
        <div className='absolute inset-0 backdrop-blur-2xl '>
            <img src="bg.avif" alt="" className='w-full h-full object-cover'/>
        </div>
      <form onSubmit={handleSubmit} className="bg-[#fff0f3] backdrop-blur-lg p-8 rounded-lg shadow-md w-full max-w-md z-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        
        {error && <p className="text-red-500 mb-4 text-sm bg-red-50 p-2 rounded">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input type="text" name="name" className="w-full border p-2 rounded" placeholder='Enter your full name' value={formData.name} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Age *</label>
          <input type="number" name="age" className="w-full border p-2 rounded" placeholder='Enter your age' value={formData.age} onChange={handleChange} required min="18" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Address *</label>
          <input type="text" name="address" className="w-full border p-2 rounded" placeholder='Enter your full address' value={formData.address} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Aadhaar Card Number *</label>
          <input type="number" name="aadhaarCardNumber" className="w-full border p-2 rounded" placeholder="Enter your 12-digit Aadhaar" value={formData.aadhaarCardNumber} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email (Optional)</label>
          <input type="email" name="email" className="w-full border p-2 rounded" placeholder='Enter your email address' value={formData.email} onChange={handleChange} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password *</label>
          <input type="password" name="password" className="w-full border p-2 rounded" placeholder='Enter your password' value={formData.password} onChange={handleChange} required minLength="6" />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#ff4d6d] text-white p-2 rounded hover:bg-[#c9184a] disabled:opacity-50"
        >
          {isLoading ? 'Registering...' : 'Sign Up'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/" className="text-[#ff4d6d] hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
}