import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Menu, X} from "lucide-react"
import {
  fetchCandidates,
  castVote,
} from "../features/candidates/candidateSlice";
import { logout , setUserVoted} from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    list: candidates,
    isLoading,
    error: candidateError,
    voteSuccess,
  } = useSelector((state) => state.candidates);
  const { user } = useSelector((state) => state.auth);


  const [localVoted, setLocalVoted] = useState(user?.isVoted || false);


  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch, voteSuccess]);


  useEffect(() => {
    if (voteSuccess) {
      setLocalVoted(true);
      dispatch(setUserVoted())
    }
  }, [voteSuccess , dispatch]);

  const handleVote = (candidateId) => {
    if (window.confirm("Are you sure? You can only cast your vote once.")) {
      dispatch(castVote(candidateId));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };


  const isAdmin = user?.role === "admin";
  

  return (
    <div className="min-h-screen bg-[#f3d5b5] text-gray-800 pt-20">
      {/* Navbar */}
      <nav className="bg-dark-emerald text-[#e7bc91] p-4 shadow-md fixed top-0 left-0 right-0 transition-all duration-500 border-none z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cast Your Vote</h1>

          <div className="hidden md:flex items-center space-x-4">
            <span className="font-medium font-semibold">
              Welcome, {user?.name} <span className="text-[#f3d5b5]">{isAdmin && "(Admin)"}</span>
            </span>
            {isAdmin && (
    <button 
      onClick={() => navigate('/admin')} 
      className="bg-[#1b263b] hover:bg-[#415a77] text-white px-4 py-2 rounded font-semibold transition-colors shadow-sm"
    >
      Admin Panel
    </button>
  )}
            <button
              onClick={() => navigate("/profile")}
              className="bg-[#1b263b] text-white hover:bg-[#415a77] px-4 py-2 rounded transition-colors"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/results")}
              className="bg-[#1b263b] hover:bg-green-600 text-white px-4 py-2 rounded transition-colors mr-2"
            >
              View Results
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#1b263b] hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>
            <button className="md:hidden inline-block font-bold"
            onClick={()=> setIsMobileMenuOpen((prev)=> !prev)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </nav>
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 pt-20 max-h-fit md:hidden backdrop-blur-2xl py-4 animate-fade-in ">
            
            <div className="flex flex-col gap-2 mt-2 mx-auto items-center justify-center  ">
                <span className="font-medium font-semibold">
              Welcome, {user?.name} <span className="text-red-500">{isAdmin && "(Admin)"}</span>
            </span>
                <button
              onClick={() => navigate("/profile")}
              className="bg-[#1b263b] text-white hover:bg-[#415a77] px-4 py-2 rounded transition-colors"
            >
              Profile
            </button>
                <button
              onClick={() => navigate("/results")}
              className="bg-[#1b263b] hover:bg-green-600 text-white px-4 py-2 rounded transition-colors mr-2"
            >
              View Results
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#1b263b] hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
                
            </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto p-6 ">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Candidates List
          </h2>
          <p className="text-gray-600">
            {isAdmin
              ? "As an admin, you are not permitted to vote."
              : "Review the candidates below and cast your vote. Remember, you can only vote once."}
          </p>
        </div>

        {/* Status Messages */}
        {candidateError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{candidateError}</p>
          </div>
        )}
        {voteSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>Your vote has been successfully recorded!</p>
          </div>
        )}

        {/* Candidates Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-xl text-gray-500 animate-pulse">
              Loading candidates...
            </p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg shadow">
            <p className="text-gray-500 text-lg">No candidates found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate._id || candidate.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col"
              >
                <div className="bg-blue-50 p-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-blue-800">
                    {candidate.name}
                  </h3>
                </div>
                <div className="p-4 flex-grow">
                  <div className="mb-2">
                    <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                      Party
                    </span>
                    <p className="text-lg font-medium text-gray-800">
                      {candidate.party}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                      Age
                    </span>
                    <p className="text-gray-800">{candidate.age} years</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => handleVote(candidate._id || candidate.id)}
                    disabled={isAdmin || localVoted}
                    className={`w-full py-2.5 rounded font-semibold transition-colors ${
                      isAdmin || localVoted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-dark-emerald  hover:bg-sea-green text-[#f3d5b5] shadow-sm"
                    }`}
                  >
                    {isAdmin
                      ? "Admins Cannot Vote"
                      : localVoted
                        ? "Already Voted"
                        : "Vote for Candidate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
