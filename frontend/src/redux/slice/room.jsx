import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedRoom: null,
};

const chatSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setSelectedRoom: (state, action) => {
      state.selectedRoom = action.payload;
    },
    updateSelectedRoom: (state, action) => {
      if (!state.selectedRoom) return;
      state.selectedRoom = {
        ...state.selectedRoom,
        ...action.payload,
      };
    },
    clearSelectedRoom: (state) => {
      state.selectedRoom = null;
    },
  },
});

export const { setSelectedRoom, updateSelectedRoom, clearSelectedRoom } =
  chatSlice.actions;
export default chatSlice.reducer;
