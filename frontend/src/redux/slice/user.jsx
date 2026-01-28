import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { decodeToken, isExpired } from "react-jwt";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export const loadUserFromToken = createAsyncThunk(
  "auth/loadUserFromToken",
  async (_, thunkAPI) => {
    try {
      // Read token from cookies
      const token = getCookie("access_token");
      if (!token) throw new Error("Token not found in cookie");

      // Check expiration
      const expired = isExpired(token); // true = expired
      if (expired) throw new Error("Token is expired");

      // Decode JWT payload
      const payload = decodeToken(token);

      return payload; // ← stored into Redux slice
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    payload: null,
    status: "idle",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payload = action.payload;
      })
      .addCase(loadUserFromToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
