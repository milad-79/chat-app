import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import counterReducer from "./slice/personal";
import userReducer from "./slice/user";
import roomReducer from "./slice/room";
import convReducer from "./slice/conversition";

const store = configureStore({
  reducer: {
    user_profile: counterReducer,
    user: userReducer,
    room: roomReducer,
    conversation: convReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
