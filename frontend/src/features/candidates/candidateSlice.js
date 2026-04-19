import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
axios.defaults.withCredentials = true;

const API_URL = `${import.meta.env.VITE_API_URL}/candidates`;


const getAuthHeaders = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};


export const fetchCandidates = createAsyncThunk('candidates/fetchAll', async (_, thunkAPI) => {
  const response = await axios.get(API_URL);
  return response.data.data; 
});

export const castVote = createAsyncThunk('candidates/vote', async (candidateId, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/vote/${candidateId}`, {}, getAuthHeaders(thunkAPI));
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Vote failed');
  }
});


export const addCandidate = createAsyncThunk('candidates/add', async (candidateData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL, candidateData, getAuthHeaders(thunkAPI));
    return response.data.data.candidate; // Your backend returns { candidate: {...}, accessToken }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add candidate');
  }
});

export const updateCandidate = createAsyncThunk('candidates/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders(thunkAPI));
    return response.data.data; // Your backend returns the updated candidate object directly here
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update candidate');
  }
});

export const removeCandidate = createAsyncThunk('candidates/delete', async (candidateId, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${candidateId}`, getAuthHeaders(thunkAPI));
    return candidateId; // Return the ID so we can filter it out of the state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete candidate');
  }
});

export const fetchVoteResults = createAsyncThunk('candidates/fetchResults', async (_, thunkAPI) => {
  try {

    const response = await axios.get(`${API_URL}/vote/count`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch results');
  }
});
const candidateSlice = createSlice({
  name: 'candidates',
  initialState: { 
    list: [], 
    results:[],
    isLoading: false, 
    error: null,
     voteSuccess: false },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchCandidates.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(castVote.fulfilled, (state) => { state.voteSuccess = true; })
      .addCase(castVote.rejected, (state, action) => { state.error = action.payload; })

      .addCase(addCandidate.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(updateCandidate.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      .addCase(removeCandidate.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c._id !== action.payload);
      })
      //Results
      .addCase(fetchVoteResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVoteResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload; 
      })
      .addCase(fetchVoteResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default candidateSlice.reducer;