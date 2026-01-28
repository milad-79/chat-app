import React from "react";
import { RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import router from "./router/main";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainerFunc } from "./config/toast.config";

function App() {
  return (
    <div className="App font-app">
      <Provider store={store}>
        <RouterProvider router={router} />
        <ToastContainerFunc />
      </Provider>
    </div>
  );
}

export default React.memo(App);
