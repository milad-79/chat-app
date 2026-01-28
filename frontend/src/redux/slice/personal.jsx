import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axios.config";

// Example async thunk that simulates fetching an initial count
export const fetchUserProfile = createAsyncThunk(
  "personal-info",
  async (id) => {
    const res = await api.post(
      "/user-detaile/get",
      { id: id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
);

const counterSlice = createSlice({
  name: "userInfo",
  initialState: {
    payload: null,
    status: "idle",
    error: null,
  },
  reducers: {
    // Update profile in state
    updateProfile: (state, action) => {
      if (!state.payload) return;
      state.payload = {
        ...state.payload,
        ...action.payload,
        imageUrl: action.payload.data.imageUrl,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payload = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateProfile } = counterSlice.actions;
export default counterSlice.reducer;
