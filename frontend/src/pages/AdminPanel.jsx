import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidates, addCandidate, updateCandidate, removeCandidate } from '../features/candidates/candidateSlice';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, isLoading } = useSelector((state) => state.candidates);
  
  const [formData, setFormData] = useState({ name: '', party: '', age: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateCandidate({ id: editingId, data: formData }));
      setEditingId(null);
    } else {
      dispatch(addCandidate(formData));
    }
    setFormData({ name: '', party: '', age: '' }); // reset form
  };

  const handleEdit = (candidate) => {
    setEditingId(candidate._id);
    setFormData({ name: candidate.name, party: candidate.party, age: candidate.age });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      dispatch(removeCandidate(id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f3d5b5] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={() => navigate('/dashboard')} className="text-dark-emerald font-bold hover:underline">
            Back to Voting Portal
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Candidate' : 'Add New Candidate'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Candidate Name</label>
                <input type="text" name="name" placeholder='Enter name of the candidate' value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Party Affiliation</label>
                <input type="text" name="party" placeholder='Enter name of the party' value={formData.party} onChange={handleChange} className="w-full border p-2 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Age</label>
                <input type="number" name="age" placeholder='Enter the age of candidate' value={formData.age} onChange={handleChange} className="w-full border p-2 rounded" required min="25" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-dark-emerald text-[#f3d5b5] p-2 rounded hover:bg-sea-green">
                  {editingId ? 'Update' : 'Add Candidate'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingId(null); setFormData({ name: '', party: '', age: '' }); }}
                    className="flex-1 bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr><td colSpan="4" className="px-6 py-4 text-center">Loading...</td></tr>
                  ) : list.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No candidates available.</td></tr>
                  ) : (
                    list.map((candidate) => (
                      <tr key={candidate._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{candidate.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{candidate.party}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{candidate.age}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleEdit(candidate)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                          <button onClick={() => handleDelete(candidate._id || candidate.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
  );
}