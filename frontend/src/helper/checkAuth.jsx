import { Navigate } from "react-router-dom";
import { useJwt } from "react-jwt";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export function ProtectedRoute({ children }) {
  const token = getCookie("access_token"); // read your cookie

  if (!token) return <Navigate to="/login" replace />; // redirect if no token

  const { isExpired } = useJwt(token);

  if (isExpired) return <Navigate to="/login" replace />;

  return children; // render protected component
}
