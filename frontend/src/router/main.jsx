import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../auth/login";
import SingUpPage from "../auth/register";
import ChatAppMain from "../chat/main";
import { ProtectedRoute } from "../helper/checkAuth";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/singup",
    element: <SingUpPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ChatAppMain />
      </ProtectedRoute>
    ),
  },
]);

export default router;
