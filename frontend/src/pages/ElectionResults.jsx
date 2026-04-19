import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVoteResults } from '../features/candidates/candidateSlice';
import { useNavigate } from 'react-router-dom';

export default function ElectionResults() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { results, isLoading } = useSelector((state) => state.candidates);

  useEffect(() => {
    dispatch(fetchVoteResults());
  }, [dispatch]);


  const leader = results.length > 0 ? results[0] : null;

  return (
    <div className="min-h-screen bg-[#f3d5b5] p-8 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold">Election Results</h1>
          <button 
            onClick={() => navigate('/dashboard')} 
            className=" text-dark-emerald font-bold hover:underline"
          >
            Back to Dashboard
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-xl text-gray-500 animate-pulse">Tallying votes...</p>
        ) : results.length === 0 ? (
          <p className="text-center text-gray-500">No votes have been cast yet.</p>
        ) : (
          <div className="space-y-8">
            {/* Winner / Leader Card */}
            {leader && leader.voteCount > 0 && (
              <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-semibold uppercase tracking-wider mb-2">Current Leader</h2>
                <h3 className="text-4xl font-bold mb-2">{leader.party}</h3>
                <p className="text-xl">{leader.voteCount} Votes</p>
              </div>
            )}

            {/* Results Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-800 uppercase">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-800 uppercase">Party</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-blue-800 uppercase">Total Votes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index} className={index === 0 && result.voteCount > 0 ? "bg-green-50" : "hover:bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-700">#{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{result.party}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-700">{result.voteCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}